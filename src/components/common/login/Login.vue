<template>
  <div class="login" @keyup.enter="handleEnter" :style="{backgroundImage:'url(' + bg + ')'}">
    <div class="login-con">
      <Card icon="log-in" title="建业至尊卡在线连锁超市系统" :bordered="false">
        <div class="form-con">
          <LoginForm ref="loginForm" @on-register="showModal" @on-success-valid="handleSubmit"></LoginForm>
          <!--<p class="login-tip">输入用户名和密码登录</p>-->
        </div>
      </Card>
    </div>
    <Register ref="register"></Register>
  </div>
</template>

<script>
  import LoginForm from './components/login-form/index'
  import {mapActions, mapMutations} from 'vuex'
  import bg from '@/assets/images/login_bg.jpg'
  import {handleSpinCustom} from '@/libs/util'
  import Register from './register'

  export default {
    data() {
      return {
        bg
      }
    },
    components: {LoginForm, Register},
    methods: {
      ...mapActions([
        'handleLogin'
      ]),
      ...mapMutations([
        'setTabFlag'
      ]),
      showModal() {
        this.$refs.register.showModal();
      },
      handleEnter() {
        console.log("enter login")
        this.$refs.loginForm.handleSubmit()
      },
      handleSubmit({username, password}) {
        handleSpinCustom();
        this.handleLogin({
          username,
          password
        }).then(res => {
          if (res) {
            this.$Spin.hide();
            this.$router.push({name: 'home'})
          }
        }).catch(err => {
          this.$Spin.hide();
          console.log(err)
        });
      }
    }
  }
</script>

<style lang="less">
  @import 'login.less';
</style>
