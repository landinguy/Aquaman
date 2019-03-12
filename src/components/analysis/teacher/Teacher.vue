<template>
  <div class="bg">
    <div class="search-div">
      <div class="search-div-item">
        <label>时间</label>
        <Select v-model="params.timeType" class="width">
          <Option value="1">今日</Option>
          <Option value="2">昨天</Option>
          <Option value="3">近7日</Option>
          <Option value="4">近30日</Option>
          <Option value="5">当前学期</Option>
          <Option value="6">当前学年</Option>
        </Select>
      </div>
      <div class="search-div-item">
        <label>学段</label>
        <Select v-model="params.stageId" @on-change="getGrades" class="width">
          <Option value="1">小学</Option>
          <Option value="2">初中</Option>
          <Option value="3">高中</Option>
        </Select>
      </div>
      <div class="search-div-item">
        <label>年级</label>
        <Select v-model="params.gradeId" class="width">
          <Option v-for="item in grades" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div class="search-div-item">
        <Button type="primary" @click="search">查询</Button>
      </div>
    </div>
    <RadioGroup v-model="params.type" @on-change="changeItem" type="button">
      <Radio label="1"><span>发布统计</span></Radio>
      <Radio label="2"><span>批改统计</span></Radio>
    </RadioGroup>
    <div style="margin-top: 16px">
      <Table stripe border :columns="columns" :data="tableData"></Table>
      <!--<Page :total="total" show-total show-elevator @on-change="changePage" style="margin-top: 16px"></Page>-->
    </div>
  </div>
</template>
<script>
  import url from '@/api/url';
  import {post, get, $get} from "@/api/ax";
  import {showTip, timestampToTime} from '@/libs/util'

  export default {
    name: 'Teacher',
    data() {
      return {
        showPie: false,
        params: {
          timeType: '1',
          stageId: '',
          gradeId: '',
          type: '1',
          startDate: '',
          endDate: '',
          // pageNo: 1,
          // pageSize: 10
        },
        grades: [],
        tableData: [],
        total: 0,
        columns: [
          {
            title: '姓名', key: 'nickname', align: 'center', ellipsis: true, minWidth: 150,
            render: (h, params) => showTip(h, params.row.nickname)
          },
          {
            title: '任教班级', key: 'teachClazz', align: 'center', ellipsis: true, minWidth: 150,
            render: (h, params) => showTip(h, params.row.teachClazz)
          },
          {
            title: '次数', key: 'cnt', align: 'center', ellipsis: true, minWidth: 150,
            render: (h, params) => showTip(h, params.row.cnt)
          }
        ]
      }
    },
    methods: {
      changePage(n) {
        this.params.pageNo = n;
        this.getData();
      },
      getGrades() {
        this.grades = [];
        let stageId = this.params.stageId;
        get(url.getGradesByStageId + stageId, {}).then(res => {
          if (res) {
            res.forEach(item => this.grades.push({label: item.gradeName, value: item.gradeId}))
          }
        }).catch(err => console.log(err));
      },
      changeItem() {
        this.search()
      },
      search() {
        // this.params.pageNo = 1;
        // this.getTotal();
        this.getData();
      },
      getData() {
        $get(url.teacherAnalysis, this.params).then(res => this.tableData = res.data).catch(err => console.log(err))
      },
      // getTotal() {
      //   const {find} = this.params;
      //   post(url.getAccountCount, {find}).then(res => this.total = res.data).catch(err => console.log(err))
      // }
    },
    computed: {},
    mounted() {
      // this.search();
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

  .search-div {
    display: flex;
    justify-content: left;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 16px;

    &-item {
      margin-bottom: 16px;
    }
  }

  label {
    margin-right: 8px;
    font-weight: bold;
    display: inline-block;
  }

  .width {
    width: 160px;
    margin-right: 32px;
  }
</style>
