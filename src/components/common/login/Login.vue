<template>
  <div class="login" @keyup.enter="handleEnter" :style="{backgroundImage:'url(' + bg + ')'}">
    <div class="login-con">
      <Card icon="log-in" title="小沃超信业务管理平台" :bordered="false">
        <div class="form-con">
          <LoginForm ref="loginForm" @on-success-valid="handleSubmit"></LoginForm>
          <p class="login-tip">输入用户名和密码登录</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
  import LoginForm from './components/login-form/index'
  import {mapActions, mapMutations} from 'vuex'
  import bg from '@/assets/images/login_bg.jpg'

  export default {
    data() {
      return {
        bg
      }
    },
    components: {
      LoginForm
    },
    methods: {
      ...mapActions([
        'handleLogin'
      ]),
      ...mapMutations([
        'setTabFlag'
      ]),
      handleEnter() {
        console.log("enter login")
        this.$refs.loginForm.handleSubmit()
      },
      handleSubmit({userName, password, remember}) {
        // this.handleLogin({username: userName, passwd: password}).then(
        //   res => {
        //     console.log(res.data);
        //     if (res.code == 0) {
        //       if(remember == true){
        //         localStorage.setItem("userName", userName)
        //         localStorage.setItem("password",password)
        //         localStorage.setItem("remember",1)
        //       }
        //       else
        //       {
        //         localStorage.setItem("userName",null)
        //         localStorage.setItem("password",null)
        //         localStorage.setItem("remember",0)
        //       }
        this.setTabFlag(0);
        this.$router.push({name: 'home_index'})
        //   }
        // },
        // err => {
        //   console.log(err)
        // }
        // );
      }
    }
  }
</script>

<style lang="less">
  @import 'login.less';
</style>
