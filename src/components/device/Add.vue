<template>
  <div ref="AddVue">
    <Modal v-model="addModal" width="640">
      <p slot="header" style="text-align:center">
        <span>{{op==='add'?'添加':'编辑'}}设备</span>
      </p>
      <div>
        <Form ref="form" :model="formData" :rules="formValidate" :label-width="100">
          <FormItem label="账号" prop="username">
            <Input v-model.trim="formData.username" placeholder="请填写账号"/>
          </FormItem>
          <FormItem label="密码" prop="password" v-if="op==='add'">
            <Input v-model.trim="formData.password" type="password" placeholder="请填写密码"/>
          </FormItem>
          <FormItem label="姓名" prop="nickname">
            <Input v-model.trim="formData.nickname" placeholder="请填写姓名"/>
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
  import {post, get, put} from "@/api/ax"

  export default {
    name: 'Add',
    data() {
      return {
        addModal: false,
        formData: {
          username: '',
          password: '',
          nickname: '',
        },
        id: '',
        formValidate: {
          username: [{required: true, message: '请填写账号', trigger: 'blur'}],
          password: [{required: true, message: '请填写密码', trigger: 'blur'}],
          nickname: [{required: true, message: '请填写姓名', trigger: 'blur'}],
        },
        op: 'add'
      }
    },
    methods: {
      showModal(isStudent = false, data) {
        if (data) {
          this.op = 'edit';
          this.setData(data);
        }
        this.addModal = true;
      },
      confirm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            const {username, password, nickname} = this.formData;
            if (this.id == '') {//添加
              let param = {username, password, nickname};
              post(url.addAccount, param).then(res => {
                this.$Message.success({
                  content: '提交成功',
                  duration: 1,
                  onClose: () => {
                    this.cancel();
                    // this.$parent.search();
                  }
                })
              }).catch(err => console.log(err));
            } else {
              let userId = this.id;
              if (this.isStudent) {
                let clazz = this.formData.clazzName[0];
                put(url.updateStudent, {userId, clazz, username, nickname}).then(res => {
                  if (res.ret_code == 0) {
                    this.$Message.success({
                      content: '提交成功',
                      duration: 1,
                      onClose: () => {
                        this.cancel();
                        this.$parent.search();
                      }
                    })
                  } else {
                    this.$Message.error(`修改失败 [${res.error_msg}]`)
                  }
                }).catch(err => console.log(err));
              } else {
                let roleData = this.setRoleData();
                put(url.updateTeacher, {userId, username, nickname, roleData}).then(res => {
                  if (res.ret_code == 0) {
                    this.$Message.success({
                      content: '提交成功',
                      duration: 1,
                      onClose: () => {
                        this.cancel();
                        this.$parent.search();
                      }
                    })
                  } else {
                    this.$Message.error(`修改失败 [${res.error_msg}]`)
                  }
                }).catch(err => console.log(err));
              }
            }
          }
        })
      },
      cancel() {
        this.addModal = false;
      },
      setData(data) {
        if (data) {
          const {username, nickname, userId} = data;

        }
      }
    },
    watch: {
      addModal(curVal, oldVal) {
        if (!curVal) {
          this.$refs.form.resetFields()
          this.op = 'add';
          this.id = '';
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
