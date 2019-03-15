<template>
  <div class="bg">
    <div v-if="content==2">
      <Add></Add>
    </div>
    <div v-if="content==1">
      <div class="search-div">
        <div class="search-div-item">
          <label>账号</label>
          <Input v-model="params.username" placeholder="请输入账号" class="width"/>
        </div>
        <div class="search-div-item">
          <label>姓名</label>
          <Input v-model="params.nickname" placeholder="请输入姓名" class="width"/>
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
          <Select v-model="params.gradeId" @on-change="getClazzData" class="width">
            <Option v-for="item in grades" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
        <div class="search-div-item">
          <label>班级</label>
          <Select v-model="params.clazzId" class="width">
            <Option v-for="item in clazzData" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
        <div class="search-div-item">
          <Button type="primary" @click="search">查询</Button>
        </div>
      </div>

      <div>
        <br>
        <Button type="primary" @click="toCreatePage">
          <Icon type="plus"></Icon>
          添加账号
        </Button>
      </div>
      <div style="margin-top: 16px">
        <Table stripe border :columns="columns" :data="tableData"></Table>
        <Page :total="total" show-total show-elevator @on-change="changePage" style="margin-top: 16px"></Page>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapMutations, mapGetters} from 'vuex'
  import {showTip, timestampToTime} from '@/libs/util'
  import url from '@/api/url'
  import {post, $del, get, $get} from "@/api/ax"
  import Add from './Add'

  export default {
    name: 'StudentList',
    data() {
      return {
        content: 1,
        params: {username: '', nickname: '', stageId: '', gradeId: '', clazzId: '', pageNum: 1, pageSize: 10},
        tableData: [], grades: [], clazzData: [],
        total: 0
      }
    },
    components: {Add},
    methods: {
      getClazzData() {
        this.clazzData = [];
        this.params.clazzId = '';
        let gradeId = this.params.gradeId;
        get(url.getClazzByGradeId + gradeId, {}).then(res => {
          const {clazzList} = res.data;
          clazzList.forEach(item => this.clazzData.push({label: item.clazzName, value: item.clazzId}))
        }).catch(err => console.log(err))
      },
      getGrades() {
        this.grades = [];
        const {stageId} = this.params;
        get(url.getGradesByStageId + stageId, {}).then(res =>
          res.data.forEach(item => this.grades.push({label: item.gradeName, value: item.gradeId}))
        ).catch(err => console.log(err));
      },
      changePage(n) {
        this.params.pageNum = n;
        this.getData();
      },
      search() {
        this.params.pageNum = 1;
        this.getData();
      },
      getData() {
        $get(url.getStudents, this.params).then(res => {
          const {total, list} = res.data;
          this.tableData = list;
          this.total = total;
        }).catch(err => console.log(err))
      },
      toCreatePage() {
        this.$router.push({name: 'addAccount'})
      },
    },
    mounted() {
      this.search()
    },
    computed: {
      ...mapGetters(['accountId', 'roleId']),
      columns() {
        const columns = [
          {
            title: '姓名', key: 'username', align: 'center', ellipsis: true, minWidth: 150,
            render: (h, params) => showTip(h, params.row.username)
          },
          {
            title: '昵称', key: 'nickname', align: 'center', ellipsis: true, minWidth: 150,
            render: (h, params) => showTip(h, params.row.nickname)
          },
          {
            title: '学段', key: 'stage', align: 'center', ellipsis: true, minWidth: 150,
            render: (h, params) => showTip(h, params.row.stage)
          },
          {
            title: '年级', key: 'grade', align: 'center', ellipsis: true, minWidth: 150,
            render: (h, params) => showTip(h, params.row.grade)
          },
          {
            title: '班级', key: 'clazz', align: 'center', ellipsis: true, minWidth: 150,
            render: (h, params) => showTip(h, params.row.clazz)
          }
        ];
        return columns;
      }
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
