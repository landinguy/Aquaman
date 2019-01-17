<template>
  <Form ref="loginForm" :model="form" :rules="rules">
    <FormItem prop="userName">
      <Input v-model="form.userName" autofocus placeholder="请输入用户名">
        <span slot="prepend">
          <Icon :size="16" type="person"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="password">
      <Input type="password" v-model="form.password" placeholder="请输入密码">
        <span slot="prepend">
          <Icon :size="14" type="locked"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem>
      <Checkbox v-model="form.remember">记住我（网吧或他人电脑上请勿勾选）</Checkbox>
    </FormItem>
    <FormItem>
      <Button @click="handleSubmit" type="primary" long>登录</Button>
    </FormItem>
  </Form>
</template>
<script>
  import { mapActions } from 'vuex'
export default {
  name: 'LoginForm',
  props: {
    userNameRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ]
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  data () {
    return {
      form: {
        userName: '',
        password: '',
        remember:false
      }
    }
  },
  computed: {
    rules () {
      return {
        userName: this.userNameRules,
        password: this.passwordRules
      }
    }
  },
  mounted(){
    var record = localStorage.getItem("remember")

    if(record == 1){
      var userName = localStorage.getItem("userName")
      var password = localStorage.getItem("password")
      console.log(userName,password)
      if(userName != null){
        this.form.userName = userName
      }
      if(password != null){
        this.form.password = password
      }
      this.form.remember = true;
    }
  },
  methods: {
    ...mapActions([
      'handleLogin'
    ]),
    handleSubmit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$emit('on-success-valid', {
            userName: this.form.userName,
            password: this.form.password,
            remember:this.form.remember
          })
        }
      })
    },

  }
}
</script>
