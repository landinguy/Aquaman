<template>
  <div ref="AddVue">
    <Modal v-model="addModal" width="540">
      <p slot="header" style="text-align:center">
        <span>用户注册</span>
      </p>
      <div>
        <Form ref="form" :model="formData" :rules="formValidate" :label-width="80">
          <FormItem label="用户名" prop="username">
            <Input v-model.trim="formData.username" placeholder="请填写用户名"/>
          </FormItem>
          <FormItem label="密码" prop="password">
            <Input v-model.trim="formData.password" type="password" placeholder="请填写密码"/>
          </FormItem>
          <FormItem label="确认密码" prop="confirmPwd">
            <Input v-model.trim="formData.confirmPwd" type="password" placeholder="请确认密码"/>
          </FormItem>
          <!--          <FormItem label="姓名" prop="nickname">-->
          <!--            <Input v-model.trim="formData.nickname" placeholder="请填写姓名"/>-->
          <!--          </FormItem>-->
          <!--          <FormItem label="用户角色" prop="role">-->
          <!--            <Select v-model="formData.role">-->
          <!--              <Option value="TEACHER">教师</Option>-->
          <!--              <Option value="STUDENT">学生</Option>-->
          <!--              <Option value="COMPANY">用人单位</Option>-->
          <!--              <Option value="INTERVIEWER">应试者</Option>-->
          <!--            </Select>-->
          <!--          </FormItem>-->

          <!--          <FormItem label="邮箱" prop="email">-->
          <!--            <Input v-model.trim="formData.email" placeholder="请填写邮箱"/>-->
          <!--          </FormItem>-->
          <FormItem label="手机号" prop="phone">
            <Input v-model.trim="formData.phone" placeholder="请填写手机号"/>
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
  import {post} from "@/api/ax"

  export default {
    name: 'Register',
    data() {
      return {
        addModal: false,
        formData: {
          username: '',
          password: '',
          confirmPwd: '',
          // nickname: '',
          phone: '',
          // email: '',
          // role: 'Normal'
        },
        formValidate: {
          username: [{required: true, message: '请填写用户名', trigger: 'blur'}],
          password: [{required: true, message: '请填写密码', trigger: 'blur'}],
          confirmPwd: [{required: true, message: '请再次输入密码', trigger: 'blur'}],
          // role: [{required: true, message: '请选择用户角色', trigger: 'change'}],
          // nickname: [{required: true, message: '请填写姓名', trigger: 'blur'}],
          phone: [
            {required: true, message: '请填写手机号', trigger: 'blur'},
            {validator: this.validatePhone, trigger: 'blur'}
          ],
          // email: [
          //   {required: true, message: '请填写邮箱', trigger: 'blur'},
          //   {type: 'email', message: '邮箱格式不正确', trigger: 'blur'}
          // ]
        },
      }
    },
    methods: {
      validatePhone(rule, value, callback) {
        let telRegexp = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/
        if (!telRegexp.test(value)) {
          callback(new Error("手机号格式不正确"));
        } else {
          callback();
        }
      },
      showModal() {
        this.addModal = true;
      },
      confirm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            const {password, confirmPwd} = this.formData;
            if (password !== confirmPwd) {
              this.$Message.warning('两次输入密码不一致');
              return
            }
            let param = this.formData;
            post(url.addAccount, param).then(res => {
              const {code, msg} = res;
              if (code === 0) {
                this.$Message.success({
                  content: '提交成功',
                  duration: 1,
                  onClose: () => this.cancel()
                })
              } else {
                this.$Message.error(msg);
              }
            }).catch(err => console.log(err));
          }
        })
      },
      cancel() {
        this.addModal = false;
      }
    },
    watch: {
      addModal(curVal, oldVal) {
        if (!curVal) this.$refs.form.resetFields()
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
