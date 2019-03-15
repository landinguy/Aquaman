<template>
  <div class="bg">
    <div class="search-div">
      <div class="search-div-item">
        <label>学段</label>
        <Select v-model="params.stageId" class="width">
          <Option value="1">小学</Option>
          <Option value="2">初中</Option>
          <Option value="3">高中</Option>
        </Select>
      </div>
      <div class="search-div-item">
        <Button type="primary" @click="search">查询</Button>
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
  import {post, get, $del} from "@/api/ax"
  import Add from './Add.vue'

  export default {
    name: 'List',
    data() {
      return {
        params: {
          pageNum: 1,
          pageSize: 10,
          stageId: '1',
        },
        columns: [
          {
            title: '年级ID', key: 'gradeId', align: 'center', ellipsis: true, minWidth: 150,
            render: (h, params) => showTip(h, params.row.gradeId)
          },
          {
            title: '所属学段', key: 'stageName', align: 'center', ellipsis: true, minWidth: 150,
            render: (h, params) => showTip(h, params.row.stageName)
          },
          {
            title: '年级名称', key: 'gradeName', align: 'center', ellipsis: true, minWidth: 150,
            render: (h, params) => showTip(h, params.row.gradeName)
          }
        ],
        tableData: [],
        total: 0
      }
    },
    components: {Add},
    methods: {
      toAddPage() {
        this.$router.push({name: 'addGrade'})
      },
      changePage(n) {
        this.params.pageNum = n;
        this.getData();
      },
      getData() {
        const {stageId} = this.params;
        get(url.getGradesByStageId + stageId, {}).then(res => this.tableData = res).catch(err => console.log(err))
      },

      search() {
        this.params.pageNum = 1;
        this.getData();
      },
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
