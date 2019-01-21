<template>
  <div class="bg">
    <div class="title">
      <h2>作业情况总览</h2>
      <p>——全校总共发布作业16份，其中统一假期作业5份</p>
    </div>
    <Row type="flex" justify="space-between">
      <Col span="7">
        <Table :columns="columns1" :data="data"></Table>
      </Col>
      <Col span="7">
        <Table :columns="columns2" :data="data"></Table>
      </Col>
      <Col span="7">
        <Table :columns="columns3" :data="data"></Table>
      </Col>
    </Row>
    <div class="teacher">
      <h3>教师使用情况分析</h3>
      <Table :columns="columns4" :data="data4"></Table>
    </div>
    <div class="student">
      <h3>学生使用情况分析</h3>
      <Table :columns="columns4" :data="data4"></Table>
    </div>
  </div>
</template>
<script>
  import {mapMutations, mapGetters} from 'vuex'
  import url from '@/api/url'
  import {post} from "@/api/ax"

  export default {
    name: 'Home',
    components: {},
    data() {
      return {
        columns1: [
          {
            title: '批改情况',
            align: 'center'
          }
        ],
        columns2: [
          {
            title: '评价情况',
            align: 'center'
          }
        ],
        columns3: [
          {
            title: '活跃程度',
            align: 'center'
          }
        ],
        data: [],
        columns4: [
          {
            title: '分析项目',
            key: 'a1'
          },
          {
            title: '昨日',
            key: 'a2'
          },
          {
            title: '近7日',
            key: 'a3'
          },
          {
            title: '近30日',
            key: 'a4'
          },
          {
            title: '当前学期',
            key: 'a5'
          },
          {
            title: '当前学年',
            key: 'a6'
          },
          {
            title: '迄今为止',
            key: 'a7'
          }
        ],
        data4: []
      }
    },
    methods: {
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
    computed: {}
  }
</script>
<style scoped lang="less">
  .bg {
    background-color: white;
    width: 100%;
    height: 100%;
    padding: 32px;
  }

  .title {
    text-align: center;
    margin-bottom: 16px;

    p {
      position: relative;
      left: 140px;
    }
  }

  .teacher, .student {
    margin-top: 16px;
    h3 {
      margin-bottom: 5px;
    }
  }
</style>
