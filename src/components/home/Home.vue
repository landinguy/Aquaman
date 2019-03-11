<template>
  <div class="bg">
    <div class="title">
      <h2>作业情况总览</h2>
      <p>——全校总共发布作业16份，其中统一假期作业5份</p>
    </div>
    <Row type="flex" justify="space-between">
      <Col span="7">
        <Table :columns="columns1" :data="data1"></Table>
      </Col>
      <Col span="7">
        <Table :columns="columns2" :data="data2"></Table>
      </Col>
      <Col span="7">
        <Table :columns="columns3" :data="data3"></Table>
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
  import {post, get, $get} from "@/api/ax"
  import {showTip, timestampToTime} from '@/libs/util'

  export default {
    name: 'Home',
    components: {},
    data() {
      return {
        columns1: [{
          title: '布置统计', align: 'center',
          children: [
            {
              title: '教师姓名', key: 'teacherName', align: 'center', ellipsis: true, minWidth: 150,
              render: (h, params) => showTip(h, params.row.teacherName)
            },
            {
              title: '班级科目', key: 'category', align: 'center', ellipsis: true, minWidth: 150,
              render: (h, params) => showTip(h, params.row.category)
            },
            {
              title: '次数', key: 'cnt', align: 'center', ellipsis: true, minWidth: 150,
              render: (h, params) => showTip(h, params.row.cnt)
            }
          ]
        }],
        columns2: [{
          title: '批改统计', align: 'center',
          children: [
            {
              title: '教师姓名', key: 'teacherName', align: 'center', ellipsis: true, minWidth: 150,
              render: (h, params) => showTip(h, params.row.teacherName)
            },
            {
              title: '班级科目', key: 'category', align: 'center', ellipsis: true, minWidth: 150,
              render: (h, params) => showTip(h, params.row.category)
            },
            {
              title: '次数', key: 'cnt', align: 'center', ellipsis: true, minWidth: 150,
              render: (h, params) => showTip(h, params.row.cnt)
            }
          ]
        }],
        columns3: [{
          title: '评价统计', align: 'center',
          children: [
            {
              title: '教师姓名', key: 'teacherName', align: 'center', ellipsis: true, minWidth: 150,
              render: (h, params) => showTip(h, params.row.teacherName)
            },
            {
              title: '班级科目', key: 'category', align: 'center', ellipsis: true, minWidth: 150,
              render: (h, params) => showTip(h, params.row.category)
            },
            {
              title: '次数', key: 'cnt', align: 'center', ellipsis: true, minWidth: 150,
              render: (h, params) => showTip(h, params.row.cnt)
            }
          ]
        }],
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
        data1: [], data2: [], data3: [], data4: []
      }
    },
    methods: {
      search() {
      },
      getData(type) {
        $get(url.overview, {type}).then(res => {
          let data = res.data;
          console.log("data#{}", data);
          if (type == 1) {
            this.data1 = data;
          } else if (type == 2) {
            this.data2 = data;
          } else if (type == 3) {
            this.data3 = data;
          }
        }).catch(err => console.log(err))
      },
    },
    mounted() {
      this.getData(1);
      this.getData(2);
      this.getData(3);
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
    }
  }

  .teacher, .student {
    margin-top: 32px;

    h3 {
      margin-bottom: 5px;
    }
  }
</style>
