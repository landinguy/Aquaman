<template>
  <div class="bg">
    <div class="welcome-div">
      <span class="text">{{accountNickname}}，您好！  欢迎使用车辆查询系统 ~</span>
    </div>
    <Card style="margin: 16px 0" v-if="roleId==='ADMIN'">
      <p slot="title">统计信息</p>
      <Row>
        <Col span="12">
          <div class="line"><label>管理员人数</label><span>{{info.adminCount}}</span></div>
          <div class="line"><label>交管所人数</label><span>{{info.jgsCount}}</span></div>
          <div class="line"><label>用户总数</label><span>{{info.total}}</span></div>
        </Col>
        <Col span="12">
          <div class="line"><label>交警人数</label><span>{{info.policeManCount}}</span></div>
          <div class="line"><label>车主人数</label><span>{{info.userCount}}</span></div>
        </Col>
      </Row>
    </Card>
    <Card style="margin: 16px 0" v-if="roleId==='JGS'">
      <p slot="title">统计信息</p>
      <Row>
        <Col span="12">
          <div class="line"><label>车辆总数</label><span>{{info.carCount}}</span></div>
          <div class="line"><label>未关闭违章记录数</label><span>{{info.unclosedCount}}</span></div>
        </Col>
        <Col span="12">
          <div class="line"><label>已关闭违章记录数</label><span>{{info.closedCount}}</span></div>
        </Col>
      </Row>
    </Card>
    <Card style="margin: 16px 0" v-if="roleId==='POLICEMAN'">
      <p slot="title">统计信息</p>
      <Row>
        <Col span="12">
          <div class="line"><label>今日违章数</label><span>{{info.todayCount}}</span></div>
          <div class="line"><label>昨日违章数</label><span>{{info.yesterdayCount}}</span></div>
        </Col>
        <Col span="12">
          <div class="line"><label>近七日违章数</label><span>{{info.weekCount}}</span></div>
          <div class="line"><label>近一个月违章数</label><span>{{info.MonthCount}}</span></div>
        </Col>
      </Row>
    </Card>
    <Card style="margin: 16px 0" v-if="roleId==='USER'">
      <p slot="title">个人信息</p>
      <Row>
        <Col span="12">
          <div class="line"><label>姓名</label><span>{{accountNickname}}</span></div>
          <div class="line"><label>车辆数</label><span>{{info.userCarCount}}</span></div>
          <div class="line"><label>手机号</label><span>{{info.phoneNumber}}</span></div>
        </Col>
        <Col span="12">
          <div class="line"><label>违章次数</label><span>{{info.peccancyCount}}</span></div>
          <div class="line"><label>未缴罚单数</label><span>{{info.unpaidCount}}</span></div>
          <div class="line"><label>邮箱</label><span>{{info.email}}</span></div>
        </Col>
      </Row>
    </Card>
  </div>
</template>
<script>
  import {mapMutations, mapGetters} from 'vuex'
  import {showTip, timestampToTime} from '@/libs/util'
  import url from '@/api/url'
  import {post, $del, get, $get, patch} from "@/api/ax"

  export default {
    name: 'Home',
    data() {
      return {
        info: {
          adminCount: 0, jgsCount: 0, policeManCount: 0, userCount: 0, total: 0,
          carCount: 0, unclosedCount: 0, closedCount: 0,
          todayCount: 0, yesterdayCount: 0, weekCount: 0, MonthCount: 0,
          userCarCount: 0, peccancyCount: 0, unpaidCount: 0, phoneNumber: '', email: ''
        },
      }
    },
    components: {},
    methods: {
      changePage(n) {
        this.params.pageNo = n;
        this.getData();
      },
      getData() {
        let params = {role: this.roleId}
        if (this.roleId === 'USER') params.uid = this.accountId
        $get(url.statistics, params).then(res => {
          if (res.code == 0) {
            this.info = res.data;
          }
        }).catch(err => console.log(err))
      }
    },
    mounted() {
      this.getData();
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

  .line {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    font-size: 14px;
    margin-bottom: 16px;

    label {
      font-weight: bold;
      margin-right: 16px;
      min-width: 80px;
    }
  }
</style>
