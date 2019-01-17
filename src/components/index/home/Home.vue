<template>
  <div class="bg">
    <Item>
      <h3 slot="title">账户总览</h3>
      <img slot="col0" :src="infoImg">
      <div slot="col1">
        <h3>{{accountNickname}}</h3><br>
        <p>{{roleId == 0 ? '管理员' : roleId == 1 ? '普通用户' : roleId == 2 ? '运营用户' : '未知'}}</p><br>
        <Row type="flex" align="middle">
          <Col>
          <img :src="rzImg" style="width: 32px;height: 32px;">
          </Col>
          <Col style="margin-left: 16px">
          <span style="color: #0C92F2">已认证</span>
          </Col>
        </Row>
      </div>
      <img slot="col2" :src="remainImg">
      <div slot="col3">
        <h3>当前可用余量：{{sms.remain + mms.remain}}</h3><br>
        <p>短信可用余量：{{sms.remain}} 条</p>
        <p>超信可用余量：{{mms.remain}} 条</p><br>
        <Button type="primary" size="small" disabled>充值</Button>
        <span style="color: gray;margin-left: 16px">充值功能暂未开放，请线下联系商务经理</span>
      </div>
    </Item>
    <Item>
      <h3 slot="title">数据总览</h3>
      <img slot="col0" :src="sendImg">
      <div slot="col1">
        <h3>今日发送总量</h3><br>
        <p>短信：{{sms.send}} 条</p>
        <p>超信：{{mms.send}} 条</p>
      </div>
      <img slot="col2" :src="sendSucImg">
      <div slot="col3">
        <h3>今日发送成功量</h3><br>
        <p>短信：{{sms.sendSuc}} 条</p>
        <p>超信：{{mms.sendSuc}} 条</p>
      </div>
    </Item>
    <Item>
      <h3 slot="title">产品总览</h3>
      <img slot="col0" :src="mmsImg">
      <div slot="col1">
        <h3>超信</h3>
        <p class="gray">支持发送图片、视频、音频、文本，以生动的富媒体形式展示给终端用户</p><br>
        <span v-if="superMsg!=1" class="red">未开通</span>
        <Button type="primary" size="small" @click="toMmsOrSms(1)" v-if="superMsg==1">立即使用</Button>
      </div>
      <img slot="col2" :src="smsImg">
      <div slot="col3">
        <h3>短信</h3>
        <p class="gray">支持发送文本长短信，将企业的产品及服务信息推广至终端用户</p><br>
        <span v-if="simpleMsg!=1" class="red">未开通</span>
        <Button type="primary" size="small" @click="toMmsOrSms(2)" v-if="simpleMsg==1">立即使用</Button>
      </div>
    </Item>
  </div>
</template>
<script>
  import Item from './Item.vue'
  import {mapMutations, mapGetters} from 'vuex'
  import url from '@/api/url'
  import {post} from "@/api/ax"
  import infoImg from '@/assets/images/info.png'
  import remainImg from '@/assets/images/remain.png'
  import sendImg from '@/assets/images/send.png'
  import sendSucImg from '@/assets/images/sendSuc.png'
  import mmsImg from '@/assets/images/mms.png'
  import smsImg from '@/assets/images/sms.png'
  import rzImg from '@/assets/images/rz.png'

  export default {
    name: 'Home',
    components: {Item},
    data() {
      return {
        infoImg,
        remainImg,
        sendImg,
        sendSucImg,
        mmsImg,
        smsImg,
        rzImg,
        mms: {
          send: 0,
          sendSuc: 0,
          remain: 0
        },
        sms: {
          send: 0,
          sendSuc: 0,
          remain: 0
        }
      }
    },
    methods: {
      ...mapMutations(['setTabFlag']),
      toMmsOrSms(n) {
        this.setTabFlag(n);
        let name = n == 1 ? 'home_mms' : 'home_sms';
        setTimeout(() => {
          this.$router.push({name: name});
        }, 100);
      },
      search() {
        let today = this.getToday();
        let st = today + " 00:00:00";
        let et = today + " 23:59:59";
        post(url.home + this.accountId, {st: st, et: et}).then(res => {
          this.mms = res.data.superStats;
          this.sms = res.data.simpleStats;
        }).catch(err => console.log(err));
      },
      getToday() {
        let date = new Date();
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        return y + '-' + m + '-' + d;
      }
    },
    mounted() {
      // this.search();
    },
    computed: {
      ...mapGetters(['accountNickname', 'roleId', 'accountId', 'superMsg', 'simpleMsg'])
    }
  }
</script>
<style scoped>
  .bg {
    background-color: white;
    width: 100%;
    height: 100%;
    padding: 32px 32px 0px;
  }

  .gray {
    color: gray;
  }

  .row {
    margin-top: 16px;
  }

  .right {
    text-align: right;
  }

  .userType {
    font-weight: bold;
    color: #FF9900;
  }

  .red {
    color: red;
    font-weight: bold
  }

  img {
    height: 64px;
    width: 64px;
  }
</style>
