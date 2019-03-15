<template>
  <div class="bg">
    <div class="search-div">
      <div class="search-div-item">
        <label>学段</label>
        <Select v-model="params.stageId" @on-change="getGrades" class="width">
          <Option value="1">小学</Option>
          <Option value="2">初中</Option>
          <Option value="3">高中</Option>
        </Select>
      </div> <div class="search-div-item">
      <label>年级</label>
      <Select v-model="params.gradeId" class="width">
        <Option v-for="item in grades" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
    </div>

      <div class="search-div-item width">
        <Button type="primary" @click="search">查询</Button>
        <Button type="ghost" @click="clear" style="margin-left: 16px">重置</Button>
      </div>
    </div>

    <div>
      <Button type="primary" @click="toAddPage">
        <Icon type="plus"></Icon>
        添加
      </Button>
    </div>
    <div style="margin-top: 8px">
      <Table stripe border :columns="columns" :data="tableData"></Table>
      <Page :total="total" show-total show-elevator @on-change="changePage" style="margin-top: 16px"></Page>
    </div>
  </div>
</template>
<script>
  import {showTip, timestampToTime} from '@/libs/util'
  import url from '@/api/url'
  import {post, get, $get, $del} from "@/api/ax"
  import Add from './Add.vue'

  export default {
    name: 'List',
    data() {
      return {
        params: {pageNum: 1, pageSize: 10, stageId: '1', gradeId: ''},
        columns: [
          {
            title: '班级ID', key: 'clazzId', align: 'center', ellipsis: true, minWidth: 150,
            render: (h, params) => showTip(h, params.row.clazzId)
          },
          {
            title: '所属学段', key: 'stageName', align: 'center', ellipsis: true, minWidth: 150,
            render: (h, params) => showTip(h, params.row.stageName)
          },
          {
            title: '所属年级', key: 'gradeName', align: 'center', ellipsis: true, minWidth: 150,
            render: (h, params) => showTip(h, params.row.gradeName)
          },
          {
            title: '班级名称', key: 'clazzName', align: 'center', ellipsis: true, minWidth: 150,
            render: (h, params) => showTip(h, params.row.clazzName)
          }
        ],
        tableData: [], grades: [], total: 0
      }
    },
    components: {Add},
    methods: {
      getGrades() {
        this.grades = [];
        const {stageId} = this.params;
        get(url.getGradesByStageId + stageId, {}).then(res =>
          res.data.forEach(item => this.grades.push({label: item.gradeName, value: item.gradeId}))
        ).catch(err => console.log(err));
      },
      toAddPage() {
        this.$router.push({name: 'addClass'})
      },
      changePage(n) {
        this.params.pageNum = n;
        this.getData();
      },
      getData() {
        this.tableData = [];
        $get(url.getClazz, this.params).then(res => {
          const {total, list} = res.data;
          this.tableData = list;
          this.total = total;
        }).catch(err => console.log(err))
      },

      search() {
        this.params.pageNum = 1;
        this.getData();
      }
      ,
      clear() {
        this.params.stageId = '1';
        this.params.gradeId = '';
      }
    },
    mounted() {
      this.search();
      this.getGrades();
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
