<template>
  <div class="bg">
    <div class="search-div">
      <div class="search-div-item">
        <label>时间</label>
        <DatePicker v-model="params.time" type="daterange" placement="bottom-start" placeholder="请选择时间"
                    class="width"></DatePicker>
      </div>
      <div class="search-div-item">
        <label>学段</label>
        <Select v-model="params.stageId" @on-change="getGrades" class="width">
          <Option value="1">小学</Option>
          <Option value="2">初中</Option>
          <Option value="3">高中</Option>
        </Select>
      </div>

    </div>
    <div class="search-div">
      <div class="search-div-item">
        <label>年级</label>
        <Select v-model="params.gradeId" class="width">
          <Option v-for="item in grades" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div class="search-div-item">
        <label>角色</label>
        <Select v-model="params.roleType" class="width" @on-change="search">
          <Option value="TEACHER">教师</Option>
          <Option value="STUDENT">学生</Option>
        </Select>
      </div>
      <div class="search-div-item">
        <Button type="primary" @click="search">查询</Button>
      </div>
    </div>
    <div>
      <div style="margin-bottom: 8px;text-align: right">
        <Button type="ghost" size="small" @click="">excel下载</Button>
      </div>
      <Table stripe border :columns="columns" :data="tableData"></Table>
      <Page :total="total" show-total show-elevator @on-change="changePage" style="margin-top: 16px"></Page>
    </div>
    <ClazzDetail ref="ClazzDetail"></ClazzDetail>
  </div>
</template>
<script>
  import url from '@/api/url';
  import {post, get, $get} from "@/api/ax";
  import {showTip, timestampToTime} from '@/libs/util'
  import ClazzDetail from './ClazzDetail'

  export default {
    name: 'Statistics',
    data() {
      return {
        params: {
          stageId: '',
          gradeId: '',
          roleType: 'TEACHER',
          time: [
            new Date(),
            new Date()
          ],
          pageSize: 10,
          pageNum: 1
        },
        grades: [], tableData: [],
        total: 0
      }
    },
    components: {ClazzDetail},
    methods: {
      parse(t) {
        return parseFloat(t) * 100 + '%'
      },
      changePage(n) {
        this.params.pageNum = n;
        this.getData();
      },
      getGrades() {
        this.grades = [];
        let stageId = this.params.stageId;
        get(url.getGradesByStageId + stageId, {}).then(res => {
          if (res.data) res.data.forEach(item => this.grades.push({label: item.gradeName, value: item.gradeId}))
        }).catch(err => console.log(err));
      },
      search() {
        this.params.pageNum = 1
        this.getData();
      },
      getData() {
        let t = this.params.time
        if (t[0]) this.params.startDate = timestampToTime(t[0], false) + ' 00:00:00'
        if (t[1]) this.params.endDate = timestampToTime(t[1], false) + ' 23:59:59'
        const {gradeId, roleType, pageSize, pageNum, startDate, endDate} = this.params
        let p = `?pageSize=${pageSize}&pageNum=${pageNum}`
        if (gradeId) p += `&gradeId=${gradeId}`
        if (roleType) p += `&roleType=${roleType}`
        if (startDate) p += `&startDate=${startDate}`
        if (endDate) p += `&endDate=${endDate}`
        console.log('---', p)
        $get(url.overviewDetail + p, {}).then(res => {
          if (res.data) {
            const {total, list} = res.data
            this.total = total
            list.forEach(l => {
              const {subjectStatList, totalStat} = l
              if (totalStat.correctRatio != null) totalStat.correctRatio = this.parse(totalStat.correctRatio)
              if (totalStat.commentRatio != null) totalStat.commentRatio = this.parse(totalStat.commentRatio)
              if (totalStat.submitRatio != null) totalStat.submitRatio = this.parse(totalStat.submitRatio)
              subjectStatList.forEach(s => {
                if (s.correctRatio != null) s.correctRatio = this.parse(s.correctRatio)
                if (s.commentRatio != null) s.commentRatio = this.parse(s.commentRatio)
                if (s.submitRatio != null) s.submitRatio = this.parse(s.submitRatio)
              })
            })
            this.tableData = list
          }
        }).catch(err => console.log(err))
      }
    },
    computed: {
      columns() {
        let column_teacher =
          [
            {
              title: '年级', key: 'gradeName', align: 'center', ellipsis: true, width: 80,
              render: (h, params) => showTip(h, params.row.gradeName)
            },
            {
              title: '班级', key: 'clazzName', align: 'center', ellipsis: true, width: 80,
              render: (h, params) => showTip(h, params.row.clazzName)
            },
            {
              title: '语文', align: 'center', ellipsis: true, width: 240,
              children: [
                {
                  title: '发布', align: 'center', width: 80,
                  render: (h, params) => showTip(h, params.row.subjectStatList[0] ? params.row.subjectStatList[0].assignCnt : '')
                },
                {
                  title: '批改', align: 'center', width: 80,
                  render: (h, params) => showTip(h, params.row.subjectStatList[0] ? params.row.subjectStatList[0].correctRatio : '')
                },
                {
                  title: '评价', align: 'center', width: 80,
                  render: (h, params) => showTip(h, params.row.subjectStatList[0] ? params.row.subjectStatList[0].commentRatio : '')
                }
              ]
            },
            {
              title: '数学', align: 'center', ellipsis: true, width: 240,
              children: [
                {
                  title: '发布', align: 'center', width: 80,
                  render: (h, params) => showTip(h, params.row.subjectStatList[1] ? params.row.subjectStatList[1].assignCnt : '')
                },
                {
                  title: '批改', align: 'center', width: 80,
                  render: (h, params) => showTip(h, params.row.subjectStatList[1] ? params.row.subjectStatList[1].correctRatio : '')
                },
                {
                  title: '评价', align: 'center', width: 80,
                  render: (h, params) => showTip(h, params.row.subjectStatList[1] ? params.row.subjectStatList[1].commentRatio : '')
                }
              ]
            },
            {
              title: '英语', align: 'center', ellipsis: true, width: 240,
              children: [
                {
                  title: '发布', align: 'center', width: 80,
                  render: (h, params) => showTip(h, params.row.subjectStatList[2] ? params.row.subjectStatList[2].assignCnt : '')
                },
                {
                  title: '批改', align: 'center', width: 80,
                  render: (h, params) => showTip(h, params.row.subjectStatList[2] ? params.row.subjectStatList[2].correctRatio : '')
                },
                {
                  title: '评价', align: 'center', width: 80,
                  render: (h, params) => showTip(h, params.row.subjectStatList[2] ? params.row.subjectStatList[2].commentRatio : '')
                }
              ]
            },
            {
              title: '物理', align: 'center', ellipsis: true, width: 240,
              children: [
                {
                  title: '发布', align: 'center', width: 80,
                  render: (h, params) => showTip(h, params.row.subjectStatList[3] ? params.row.subjectStatList[3].assignCnt : '')
                },
                {
                  title: '批改', align: 'center', width: 80,
                  render: (h, params) => showTip(h, params.row.subjectStatList[3] ? params.row.subjectStatList[3].correctRatio : '')
                },
                {
                  title: '评价', align: 'center', width: 80,
                  render: (h, params) => showTip(h, params.row.subjectStatList[3] ? params.row.subjectStatList[3].commentRatio : '')
                }
              ]
            },
            {
              title: '化学', align: 'center', ellipsis: true, width: 240,
              children: [
                {
                  title: '发布', align: 'center', width: 80,
                  render: (h, params) => showTip(h, params.row.subjectStatList[4] ? params.row.subjectStatList[4].assignCnt : '')
                },
                {
                  title: '批改', align: 'center', width: 80,
                  render: (h, params) => showTip(h, params.row.subjectStatList[4] ? params.row.subjectStatList[4].correctRatio : '')
                },
                {
                  title: '评价', align: 'center', width: 80,
                  render: (h, params) => showTip(h, params.row.subjectStatList[4] ? params.row.subjectStatList[4].commentRatio : '')
                }
              ]
            },
            {
              title: '生物', align: 'center', ellipsis: true, width: 240,
              children: [
                {
                  title: '发布', align: 'center', width: 80,
                  render: (h, params) => showTip(h, params.row.subjectStatList[5] ? params.row.subjectStatList[5].assignCnt : '')
                },
                {
                  title: '批改', align: 'center', width: 80,
                  render: (h, params) => showTip(h, params.row.subjectStatList[5] ? params.row.subjectStatList[5].correctRatio : '')
                },
                {
                  title: '评价', align: 'center', width: 80,
                  render: (h, params) => showTip(h, params.row.subjectStatList[5] ? params.row.subjectStatList[5].commentRatio : '')
                }
              ]
            },
            {
              title: '政治', align: 'center', ellipsis: true, width: 240,
              children: [
                {
                  title: '发布', align: 'center', width: 80,
                  render: (h, params) => showTip(h, params.row.subjectStatList[6] ? params.row.subjectStatList[6].assignCnt : '')
                },
                {
                  title: '批改', align: 'center', width: 80,
                  render: (h, params) => showTip(h, params.row.subjectStatList[6] ? params.row.subjectStatList[6].correctRatio : '')
                },
                {
                  title: '评价', align: 'center', width: 80,
                  render: (h, params) => showTip(h, params.row.subjectStatList[6] ? params.row.subjectStatList[6].commentRatio : '')
                }
              ]
            },
            {
              title: '历史', align: 'center', ellipsis: true, width: 240,
              children: [
                {
                  title: '发布', align: 'center', width: 80,
                  render: (h, params) => showTip(h, params.row.subjectStatList[8] ? params.row.subjectStatList[8].assignCnt : '')
                },
                {
                  title: '批改', align: 'center', width: 80,
                  render: (h, params) => showTip(h, params.row.subjectStatList[8] ? params.row.subjectStatList[8].correctRatio : '')
                },
                {
                  title: '评价', align: 'center', width: 80,
                  render: (h, params) => showTip(h, params.row.subjectStatList[8] ? params.row.subjectStatList[8].commentRatio : '')
                }
              ]
            },
            {
              title: '地理', align: 'center', ellipsis: true, width: 240,
              children: [
                {
                  title: '发布', align: 'center', width: 80,
                  render: (h, params) => showTip(h, params.row.subjectStatList[9] ? params.row.subjectStatList[9].assignCnt : '')
                },
                {
                  title: '批改', align: 'center', width: 80,
                  render: (h, params) => showTip(h, params.row.subjectStatList[9] ? params.row.subjectStatList[9].correctRatio : '')
                },
                {
                  title: '评价', align: 'center', width: 80,
                  render: (h, params) => showTip(h, params.row.subjectStatList[9] ? params.row.subjectStatList[9].commentRatio : '')
                }
              ]
            },
            {
              title: '统计', align: 'center', ellipsis: true, width: 240,
              children: [
                {
                  title: '发布', align: 'center', width: 80,
                  render: (h, params) => showTip(h, params.row.totalStat ? params.row.totalStat.assignCnt : '')
                },
                {
                  title: '批改', align: 'center', width: 80,
                  render: (h, params) => showTip(h, params.row.totalStat ? params.row.totalStat.correctRatio : '')
                },
                {
                  title: '评价', align: 'center', width: 80,
                  render: (h, params) => showTip(h, params.row.totalStat ? params.row.totalStat.commentRatio : '')
                }
              ]
            }
          ]
        let column_student =
          [
            {
              title: '年级', key: 'gradeName', align: 'center', ellipsis: true, width: 80,
              render: (h, params) => showTip(h, params.row.gradeName)
            },
            {
              title: '班级', key: 'clazzName', align: 'center', ellipsis: true, width: 80,
              render: (h, params) =>
                h('a', {
                  on: {
                    click: () => {
                      let clazzId = params.row.clazzId
                      this.$refs.ClazzDetail.showModal({clazzId, ...this.params})
                    }
                  }
                }, params.row.clazzName)
            },
            {
              title: '语文', align: 'center', ellipsis: true, width: 240,
              children: [
                {
                  title: '提交量', align: 'center', width: 80,
                  render: (h, params) => showTip(h, params.row.subjectStatList[0] ? params.row.subjectStatList[0].submitCnt : '')
                },
                {
                  title: '提交', align: 'center', width: 80,
                  render: (h, params) => showTip(h, params.row.subjectStatList[0] ? params.row.subjectStatList[0].submitRatio : '')
                }
              ]
            },
            {
              title: '数学', align: 'center', ellipsis: true, width: 240,
              children: [
                {
                  title: '提交量', align: 'center', width: 80,
                  render: (h, params) => showTip(h, params.row.subjectStatList[1] ? params.row.subjectStatList[1].submitCnt : '')
                },
                {
                  title: '提交', align: 'center', width: 80,
                  render: (h, params) => showTip(h, params.row.subjectStatList[1] ? params.row.subjectStatList[1].submitRatio : '')
                }
              ]
            },
            {
              title: '英语', align: 'center', ellipsis: true, width: 240,
              children: [
                {
                  title: '提交量', align: 'center', width: 80,
                  render: (h, params) => showTip(h, params.row.subjectStatList[2] ? params.row.subjectStatList[2].submitCnt : '')
                },
                {
                  title: '提交', align: 'center', width: 80,
                  render: (h, params) => showTip(h, params.row.subjectStatList[2] ? params.row.subjectStatList[2].submitRatio : '')
                }
              ]
            },
            {
              title: '物理', align: 'center', ellipsis: true, width: 240,
              children: [
                {
                  title: '提交量', align: 'center', width: 80,
                  render: (h, params) => showTip(h, params.row.subjectStatList[3] ? params.row.subjectStatList[3].submitCnt : '')
                },
                {
                  title: '提交', align: 'center', width: 80,
                  render: (h, params) => showTip(h, params.row.subjectStatList[3] ? params.row.subjectStatList[3].submitRatio : '')
                }
              ]
            },
            {
              title: '化学', align: 'center', ellipsis: true, width: 240,
              children: [
                {
                  title: '提交量', align: 'center', width: 80,
                  render: (h, params) => showTip(h, params.row.subjectStatList[4] ? params.row.subjectStatList[4].submitCnt : '')
                },
                {
                  title: '提交', align: 'center', width: 80,
                  render: (h, params) => showTip(h, params.row.subjectStatList[4] ? params.row.subjectStatList[4].submitRatio : '')
                }
              ]
            },
            {
              title: '生物', align: 'center', ellipsis: true, width: 240,
              children: [
                {
                  title: '提交量', align: 'center', width: 80,
                  render: (h, params) => showTip(h, params.row.subjectStatList[5] ? params.row.subjectStatList[5].submitCnt : '')
                },
                {
                  title: '提交', align: 'center', width: 80,
                  render: (h, params) => showTip(h, params.row.subjectStatList[5] ? params.row.subjectStatList[5].submitRatio : '')
                }
              ]
            },
            {
              title: '政治', align: 'center', ellipsis: true, width: 240,
              children: [
                {
                  title: '提交量', align: 'center', width: 80,
                  render: (h, params) => showTip(h, params.row.subjectStatList[6] ? params.row.subjectStatList[6].submitCnt : '')
                },
                {
                  title: '提交', align: 'center', width: 80,
                  render: (h, params) => showTip(h, params.row.subjectStatList[6] ? params.row.subjectStatList[6].submitRatio : '')
                }
              ]
            },
            {
              title: '历史', align: 'center', ellipsis: true, width: 240,
              children: [
                {
                  title: '提交量', align: 'center', width: 80,
                  render: (h, params) => showTip(h, params.row.subjectStatList[8] ? params.row.subjectStatList[8].submitCnt : '')
                },
                {
                  title: '提交', align: 'center', width: 80,
                  render: (h, params) => showTip(h, params.row.subjectStatList[8] ? params.row.subjectStatList[8].submitRatio : '')
                }
              ]
            },
            {
              title: '地理', align: 'center', ellipsis: true, width: 240,
              children: [
                {
                  title: '提交量', align: 'center', width: 80,
                  render: (h, params) => showTip(h, params.row.subjectStatList[9] ? params.row.subjectStatList[9].submitCnt : '')
                },
                {
                  title: '提交', align: 'center', width: 80,
                  render: (h, params) => showTip(h, params.row.subjectStatList[9] ? params.row.subjectStatList[9].submitRatio : '')
                }
              ]
            },
            {
              title: '统计', align: 'center', ellipsis: true, width: 240,
              children: [
                {
                  title: '提交量', align: 'center', width: 80,
                  render: (h, params) => showTip(h, params.row.totalStat ? params.row.totalStat.submitCnt : '')
                },
                {
                  title: '提交', align: 'center', width: 80,
                  render: (h, params) => showTip(h, params.row.totalStat ? params.row.totalStat.submitRatio : '')
                }
              ]
            }
          ]
        return this.params.roleType === 'TEACHER' ? column_teacher : column_student
      }
    },
    mounted() {
      this.search();
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
    margin-right: 8px;
    font-weight: bold;
    display: inline-block;
  }

  .width {
    width: 180px;
    margin-right: 32px;
  }
</style>
