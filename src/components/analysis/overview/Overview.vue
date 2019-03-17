<template>
  <div class="bg">
    <div class="title">
      <h2>作业情况总览</h2>
      <p>——截止目前全校总共布置作业<span> {{total}} </span>份</p>
    </div>
    <Row type="flex" justify="space-between">
      <Col span="7">
        <Item title="布置统计" :data="data1"></Item>
      </Col>
      <Col span="7">
        <Item title="批改统计" :data="data2"></Item>
      </Col>
      <Col span="7">
        <Item title="评价统计" :data="data3"></Item>
      </Col>
    </Row>
    <div class="teacher">
      <h3>教师使用情况分析</h3>
      <Table :columns="columns4" :data="data4"></Table>
    </div>
    <!--<div class="student">-->
    <!--<h3>学生使用情况分析</h3>-->
    <!--<Table :columns="columns4" :data="data5"></Table>-->
    <!--</div>-->
  </div>
</template>
<script>
  import {mapMutations, mapGetters} from 'vuex'
  import url from '@/api/url'
  import {post, get, $get} from "@/api/ax"
  import {showTip, timestampToTime} from '@/libs/util'
  import Item from './component/Item'

  export default {
    name: 'Overview',
    components: {Item},
    data() {
      return {
        columns4: [
          {
            title: '分析项目', key: 'name', align: 'center', ellipsis: true, minWidth: 100,
            render: (h, params) => showTip(h, params.row.name)
          },
          {
            title: '昨日', key: 'yesterday', align: 'center', ellipsis: true, minWidth: 100,
            render: (h, params) => showTip(h, params.row.yesterday)
          },
          {
            title: '近7日', key: 'week', align: 'center', ellipsis: true, minWidth: 100,
            render: (h, params) => showTip(h, params.row.week)
          },
          {
            title: '近30日', key: 'month', align: 'center', ellipsis: true, minWidth: 100,
            render: (h, params) => showTip(h, params.row.month)
          },
          {
            title: '当前学期', key: 'semester', align: 'center', ellipsis: true, minWidth: 100,
            render: (h, params) => showTip(h, params.row.semester)
          },
          {
            title: '当前学年', key: 'year', align: 'center', ellipsis: true, minWidth: 100,
            render: (h, params) => showTip(h, params.row.year)
          },
          {
            title: '迄今为止', key: 'total', align: 'center', ellipsis: true, minWidth: 100,
            render: (h, params) => showTip(h, params.row.total)
          }
        ],
        total: 0,
        data1: [], data2: [], data3: [], data4: [], data5: []
      }
    },
    methods: {
      search() {
      },
      getData() {
        for (let i = 1; i <= 6; i++) {
          $get(url.overview, {type: i}).then(res => {
            let subjectStat = res.data.subjectStat;
            let homeworkStat = res.data.homeworkStat;
            if (i == 1) {
              this.data1 = subjectStat;
            } else if (i == 2) {
              this.data2 = subjectStat;
            } else if (i == 3) {
              this.data3 = subjectStat;
            } else if (i == 4 || i == 5 || i == 6) {
              homeworkStat.name = i == 4 ? '作业布置次数' : i == 5 ? '批改作业次数' : i == 6 ? '评价作业次数' : '';
              if (i == 4) this.total = homeworkStat.total;
              this.data4.push(homeworkStat);
            }
          }).catch(err => console.log(err))
        }
      },
    },
    mounted() {
      this.getData()
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
    margin-bottom: 32px;

    p {
      position: relative;
      left: 140px;

      span {
        color: red;
        font-weight: bold;
      }
    }
  }

  .teacher, .student {
    margin-top: 32px;

    h3 {
      margin-bottom: 5px;
    }
  }
</style>
