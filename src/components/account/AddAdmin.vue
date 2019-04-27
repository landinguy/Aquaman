<template>
  <div ref="AddVue">
    <Modal v-model="addModal" width="640">
      <p slot="header" style="text-align:center">
        <span>{{op==='add'?'添加':'编辑'}}账号</span>
      </p>
      <div>
        <Form ref="form" :model="formData" :rules="formValidate" :label-width="100">
          <FormItem label="账号" prop="username">
            <Input v-model.trim="formData.username" placeholder="请填写账号" :disabled="op==='edit'"/>
          </FormItem>
          <FormItem label="密码" prop="password">
            <Input v-model.trim="formData.password" type="password" placeholder="请填写密码"/>
          </FormItem>
          <FormItem label="姓名" prop="nickname">
            <Input v-model.trim="formData.nickname" placeholder="请填写姓名"/>
          </FormItem>
          <FormItem label="学校" prop="schoolId">
            <Select v-model="formData.schoolId" placement="bottom">
              <Option v-for="item in schools" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Form>
      </div>
      <div slot="footer" style="text-align: center">
        <Button type="primary" shape="circle" class="radio_len" @click="confirm">提交</Button>
        <Button type="ghost" shape="circle" class="radio_len" style="margin-left: 20px" @click="cancel">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import url from '@/api/url'
  import {post, get, $get, put} from "@/api/ax"

  export default {
    name: 'AddAdmin',
    data() {
      return {
        addModal: false,
        formData: {
          username: '',
          password: '',
          nickname: '',
          schoolId: '',
        },
        id: '',
        formValidate: {
          username: [{required: true, message: '请填写账号', trigger: 'blur'}],
          password: [{required: true, message: '请填写密码', trigger: 'blur'}],
          nickname: [{required: true, message: '请填写姓名', trigger: 'blur'}],
          schoolId: [{required: true, message: '请选择学校', trigger: 'change'}],
        },
        op: 'add',
        schools: []
      }
    },
    methods: {
      showModal(data) {
        if (data) {
          this.op = 'edit';
          this.setData(data);
        } else {
          this.$refs.form.resetFields()
        }
        this.addModal = true
      },
      confirm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            const {schoolId, ...rest} = this.formData
            if (this.id == '') {//添加
              let roleData = [{type: 'ADMIN', schoolId}]
              post(url.addAccount, {...rest, roleData}).then(res => {
                if (res.ret_code == 0) {
                  this.$Message.success({
                    content: '提交成功',
                    duration: 1,
                    onClose: () => {
                      this.cancel()
                      this.$parent.search()
                    }
                  })
                } else {
                  this.$Message.error(`添加失败 [${res.error_msg}]`)
                }
              }).catch(err => console.log(err));
            } else {
              let userId = this.id
              const {username, ...r} = rest
              put(url.addAccount, {schoolId, userId, ...r}).then(res => {
                if (res.ret_code == 0) {
                  this.$Message.success({
                    content: '提交成功',
                    duration: 1,
                    onClose: () => {
                      this.cancel()
                      this.$parent.search()
                    }
                  })
                } else {
                  this.$Message.error(`添加失败 [${res.error_msg}]`)
                }
              }).catch(err => console.log(err));

            }
          }
        })
      },
      cancel() {
        this.addModal = false;
      },
      setData(data) {
        if (data) {
          const {username, nickname, userId, schoolId} = data
          this.id = userId
          this.formData.username = username
          this.formData.nickname = nickname
          setTimeout(() => this.formData.schoolId = schoolId, 200)
        }
      },
      getSchools() {
        this.schools = []
        let param = {}
        if (this.op === 'add') param.type = 'undistributed'
        $get(url.getSchool, param).then(res => {
          const {list} = res.data
          list.forEach(item => this.schools.push({label: item.name, value: item.id}))
        }).catch(err => console.log(err))
      }
    },
    watch: {
      addModal(curVal, oldVal) {
        if (!curVal) {
          this.$refs.form.resetFields()
          this.op = 'add'
          this.id = ''
        } else {
          this.getSchools()
        }
      }
    }
  }
</script>
<style lang="less">
  .radio_len {
    width: 80px;
    text-align: center;
  }
</style>
