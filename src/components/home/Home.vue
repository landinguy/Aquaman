<template>
  <div class="bg">
    <div class="welcome-div">
      <span class="text">{{accountNickname}}，您好！ 欢迎使用建业至尊卡在线连锁超市系统 ~</span>
    </div>

    <!--    <div style="margin-top: 32px">-->
    <!--      <h3 style="margin-bottom: 8px">用户信息</h3>-->
    <!--      <p>账号： {{accountNickname}}</p>-->
    <!--      <p>手机号： {{phone}}</p>-->
    <!--      <p>邮箱： {{email}}</p>-->
    <!--    </div>-->
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'

  export default {
    name: 'Home',
    data() {
      return {}
    },
    components: {},
    methods: {},
    mounted() {
    },
    computed: {
      ...mapGetters(['accountId', 'roleId', 'accountNickname', 'phone', 'email'])
    }
  }
</script>
<style scoped lang="less">
  .bg {
    background-color: white;
    width: 100%;
    height: 100%;
    padding: 32px;
  }

  .radio_len {
    width: 80px;
    text-align: center;
  }

  .welcome-div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;

    .text {
      letter-spacing: 2px;
      font-size: 16px;
      font-style: italic;
      font-weight: bold;
    }
  }
</style>
