<template>
  <div class="bg">
    <div class="welcome-div">
      <span class="text">{{accountNickname}}，您好！  欢迎使用多用途安全试题库系统 ~</span>
    </div>
    <div style="margin-top: 32px" v-if="roleId==='ADMIN'">
      <Button type="primary" shape="circle" class="radio_len" @click="backup">备份数据</Button>
      <Button type="ghost" shape="circle" class="radio_len" style="margin-left: 20px" @click="restore">还原数据</Button>
    </div>
    <div style="margin-top: 32px" v-if="roleId==='STUDENT'">
      <p v-if="className!=null">所在班级：{{className}}</p>
      <Button type="primary" shape="circle" class="radio_len" @click="apply" v-if="className==null">申请班级</Button>
    </div>
    <Apply ref="ApplyVue"/>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'
  import {get} from "@/api/ax"
  import url from '@/api/url'
  import Apply from "../class/Apply";

  export default {
    name: 'Home',
    data() {
      return {
        className: null
      }
    },
    components: {Apply},
    methods: {
      apply() {
        this.$refs.ApplyVue.showModal();
      },
      backup() {
        get(url.backup, {}).then(res => {
          if (res) {
            this.$Message.success('备份数据成功！')
          } else {
            this.$Message.error('备份数据失败！')
          }
        }).catch(err => console.log(err));
      },
      restore() {
        get(url.restore, {}).then(res => {
          const {code, msg} = res;
          if (code === 0) {
            this.$Message.success('还原数据成功！')
          } else {
            this.$Message.error(msg)
          }
        }).catch(err => console.log(err));
      },
      getClassName() {
        get(url.getClassName + this.accountId, {}).then(res => {
          const {code, msg, data} = res;
          if (code === 0) {
            this.className = data;
          } else {
            this.$Message.error(msg)
          }
        }).catch(err => console.log(err));
      }
    },
    mounted() {
      if (this.roleId === 'STUDENT') this.getClassName();
    },
    computed: {
      ...mapGetters(['accountId', 'roleId', 'accountNickname'])
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
