<template>
  <div ref="AddVue">
    <Modal v-model="addModal" width="640">
      <p slot="header" style="text-align:center">
        <span>{{op==='add'?'添加':'编辑'}}学校</span>
      </p>
      <div>
        <Form ref="form" :model="formData" :rules="formValidate" :label-width="100" width="540px">
          <FormItem label="学校名称" prop="name">
            <Input v-model.trim="formData.name" placeholder="请填写学校名称"/>
          </FormItem>
          <FormItem label="学校编号" prop="schoolCode">
            <Input v-model.trim="formData.schoolCode" placeholder="请填写学校编号"/>
          </FormItem>
        </Form>
      </div>
      <div slot="footer" style="text-align: center">
        <Button type="primary" shape="circle" class="radio_len" @click="confirm">提交</Button>
        <Button type="default" shape="circle" class="radio_len" style="margin-left: 20px" @click="cancel">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import url from '@/api/url'
  import {post, put} from "@/api/ax"

  export default {
    name: 'AddSchool',
    data() {
      return {
        addModal: false,
        formData: {name: '', schoolCode: ''},
        id: '',
        formValidate: {
          name: [{required: true, message: '请填写学校名称', trigger: 'blur'}],
          schoolCode: [{required: true, message: '请填写学校编号', trigger: 'blur'}]
        },
        op: 'add'
      }
    },
    methods: {
      showModal(data) {
        if (data) {
          this.op = 'edit';
          this.setData(data);
        }
        this.addModal = true;
      },
      cancel() {
        this.addModal = false;
      },
      confirm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            if (this.id === '') {
              post(url.addSchool, this.formData).then(res => {
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
                  this.$Message.error(res.error_msg ? res.error_msg : '提交失败')
                }
              }).catch(err => console.log(err))
            } else {
              this.formData.id = this.id
              put(url.addSchool, this.formData).then(res => {
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
                  this.$Message.error(res.error_msg ? res.error_msg : '提交失败')
                }
              }).catch(err => console.log(err))
            }
          }
        })
      },
      setData(data) {
        if (data) {
          const {id, name, schoolCode} = data;
          this.id = id
          this.formData.name = name
          this.formData.schoolCode = schoolCode
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
