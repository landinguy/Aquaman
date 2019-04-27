<template>
  <div class="login" @keyup.enter="handleEnter" :style="{backgroundImage:'url(' + bg + ')'}">
    <div class="login-con">
      <Card icon="log-in" title="学校管理平台" :bordered="false">
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
  import {handleSpinCustom} from '@/libs/util'

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
      handleSubmit({username, password}) {
        handleSpinCustom();
        this.handleLogin({
          username,
          password
        }).then(res => {
          if (res) {
            this.$Spin.hide()
            let role = sessionStorage.getItem('roleId')
            let name = role === 'SUPER' ? 'list' : 'info'
            this.$router.push({name})
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
