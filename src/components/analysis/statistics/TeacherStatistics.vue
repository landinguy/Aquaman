<template>
  <div class="bg">
    <div class="search-div">
      <div class="search-div-item">
        <label>时间</label>
        <Select v-model="params.timeType" class="width">
          <Option value="3">近7日</Option>
          <Option value="4">近30日</Option>
          <Option value="7">自定义</Option>
        </Select>
      </div>
      <div class="search-div-item" v-if="params.timeType==7">
        <label>自定义</label>
        <DatePicker v-model="params.time" type="daterange" placement="bottom-start" placeholder="请选择时间段"
                    class="width"></DatePicker>
      </div>
    </div>
    <div class="search-div">
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
    </div>
    <div class="search-div">
      <div class="search-div-item">
        <label>班级</label>
        <Select v-model="params.clazzId" class="width">
          <Option v-for="item in clazzData" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div class="search-div-item">
        <label>科目</label>
        <Select v-model="params.subjectId" class="width">
          <Option v-for="item in subjectData" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div class="search-div-item">
        <Button type="primary" @click="search">查询</Button>
      </div>
    </div>
    <div>
      <div style="margin-bottom: 8px;text-align: right">
        <Button type="ghost" size="small" @click="download">excel下载</Button>
      </div>
      <Table stripe border :columns="columns" :data="tableData"></Table>
      <Page :total="total" show-total show-elevator @on-change="changePage" style="margin-top: 16px"></Page>
    </div>
  </div>
</template>
<script>
  import baseUrl from "@/libs/url"
  import url from '@/api/url';
  import {post, get, $get} from "@/api/ax";
  import {showTip, timestampToTime} from '@/libs/util'

  export default {
    name: 'TeacherStatistics',
    data() {
      return {
        params: {
          timeType: '3',
          stageId: '',
          gradeId: '',
          clazzId: '',
          subjectId: '',
          time: [],
          pageSize: 10,
          pageNum: 1
        },
        grades: [], tableData: [], subjectData: [], clazzData: [],
        total: 0,
        paramsStr: null
      }
    },
    methods: {
      download() {
        let access_token = sessionStorage.getItem('accessToken')
        $get(url.downloadTeacher + this.paramsStr + `&access_token=${access_token}`, {}).then(res => {
          if (res.data) window.open('http://220.248.55.84:8888/' + res.data)
          // if (res.data) window.open(baseUrl.base + '/' + +res.data)
        }).catch(err => console.log(err))
      },
      getClazzData(gradeId) {
        this.clazzData = []
        this.params.clazzId = ''
        if (gradeId) {
          get(url.getClazzByGradeId + gradeId, {}).then(res => {
            const {clazzList} = res.data
            clazzList.forEach(item => this.clazzData.push({label: item.clazzName, value: item.clazzId}))
          }).catch(err => console.log(err))
        }
      },
      parse(t) {
        return parseFloat(t) * 100 + '%'
      },
      changePage(n) {
        this.params.pageNum = n;
        this.getData();
      },
      getGrades(stageId) {
        this.grades = []
        this.subjectData = []
        this.params.gradeId = ''
        this.params.subjectId = ''
        if (stageId) {
          get(url.getGradesByStageId + stageId, {}).then(res => {
            if (res.data) res.data.forEach(item => this.grades.push({label: item.gradeName, value: item.gradeId}))
          }).catch(err => console.log(err));

          get(url.getSubjectByStageId + stageId, {}).then(res => {
            if (res) {
              let subjectList = res.data.subjectList;
              subjectList.forEach(item => this.subjectData.push({label: item.name, value: item.id}))
            }
          }).catch(err => console.log(err))
        }
      },
      search() {
        this.params.pageNum = 1
        this.getData();
      },
      setParamsStr() {
        let tt = this.params.timeType
        if (tt == 7) {
          let t = this.params.time
          if (t[0]) this.params.startDate = timestampToTime(t[0], false) + ' 00:00:00'
          if (t[1]) this.params.endDate = timestampToTime(t[1], false) + ' 23:59:59'
        }
        const {clazzId, subjectId, pageSize, pageNum, timeType, startDate, endDate} = this.params
        let p = `?pageSize=${pageSize}&pageNum=${pageNum}`
        if (clazzId) p += `&clazzId=${clazzId}`
        if (subjectId) p += `&subjectId=${subjectId}`
        if (timeType) p += `&timeType=${timeType}`
        if (startDate) p += `&startDate=${startDate}`
        if (endDate) p += `&endDate=${endDate}`
        this.paramsStr = p
      },
      getData() {
        this.setParamsStr()
        $get(url.overviewTeacher + this.paramsStr, {}).then(res => {
          if (res.data) {
            const {total, list} = res.data
            this.total = total
            this.tableData = list
          }
        }).catch(err => console.log(err))
      }
    },
    computed: {
      columns() {
        let columns =
          [
            {
              title: '学生人数', key: 'studentCnt', align: 'center', ellipsis: true, minWidth: 80,
              render: (h, params) => showTip(h, params.row.studentCnt)
            },
            {
              title: '科目', key: 'subjectName', align: 'center', ellipsis: true, minWidth: 80,
              render: (h, params) => showTip(h, params.row.subjectName)
            },
            {
              title: '作业名称', key: 'homeworkName', align: 'center', ellipsis: true, minWidth: 120,
              render: (h, params) => showTip(h, params.row.homeworkName)
            },
            {
              title: '已提交', key: 'submitCnt', align: 'center', ellipsis: true, minWidth: 80,
              render: (h, params) => showTip(h, params.row.submitCnt)
            },
            {
              title: '未提交', key: 'notSubmitCnt', align: 'center', ellipsis: true, minWidth: 80,
              render: (h, params) => showTip(h, params.row.notSubmitCnt)
            },
            {
              title: '提交率', key: 'submitRatio', align: 'center', ellipsis: true, minWidth: 80,
              render: (h, params) => showTip(h, this.parse(params.row.submitRatio))
            },
            {
              title: '平均分', key: 'average', align: 'center', ellipsis: true, minWidth: 80,
              render: (h, params) => showTip(h, params.row.average)
            }
          ]
        return columns
      }
    },
    mounted() {
      this.search()
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

    &-item {
      margin-bottom: 16px;
    }
  }

  label {
    /*margin-right: 5px;*/
    font-weight: bold;
    display: inline-block;
    width: 40px;
    text-align: left;
  }

  .width {
    width: 180px;
    margin-right: 32px;
  }
</style>
