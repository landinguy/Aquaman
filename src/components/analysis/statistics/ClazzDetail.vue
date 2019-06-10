<template>
  <div>
    <Modal v-model="addModal" width="960">
      <p slot="header" style="text-align:center">
        <span>班级详情</span>
      </p>
      <div>
        <div style="margin-bottom: 8px;text-align: right">
          <Button type="default" size="small" @click="download">excel下载</Button>
        </div>
        <Table stripe border :columns="columns" :data="tableData"></Table>
        <Page :total="total" show-total show-elevator @on-change="changePage" style="margin-top: 16px"></Page>
      </div>
      <div slot="footer" style="text-align: center">
        <Button type="default" shape="circle" class="radio_len" @click="close">关闭</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import baseUrl from "@/libs/url"
  import url from '@/api/url';
  import {post, get, $get} from "@/api/ax";
  import {showTip, timestampToTime} from '@/libs/util'

  export default {
    name: 'ClazzDetail',
    data() {
      return {
        addModal: false,
        total: 0,
        tableData: [],
        columns: [
          {
            title: '年级', key: 'gradeName', align: 'center', ellipsis: true, width: 80,
            render: (h, params) => showTip(h, params.row.gradeName)
          },
          {
            title: '班级', key: 'clazzName', align: 'center', ellipsis: true, width: 80,
            render: (h, params) => showTip(h, params.row.clazzName)
          },
          {
            title: '姓名', key: 'studentName', align: 'center', ellipsis: true, width: 80,
            render: (h, params) => showTip(h, params.row.studentName)
          },
          {
            title: '语文', align: 'center', ellipsis: true, width: 240,
            children: [
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
                title: '提交', align: 'center', width: 80,
                render: (h, params) => showTip(h, params.row.subjectStatList[1] ? params.row.subjectStatList[1].submitRatio : '')
              }
            ]
          },
          {
            title: '英语', align: 'center', ellipsis: true, width: 240,
            children: [
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
                title: '提交', align: 'center', width: 80,
                render: (h, params) => showTip(h, params.row.subjectStatList[3] ? params.row.subjectStatList[3].submitRatio : '')
              }
            ]
          },
          {
            title: '化学', align: 'center', ellipsis: true, width: 240,
            children: [
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
                title: '提交', align: 'center', width: 80,
                render: (h, params) => showTip(h, params.row.subjectStatList[5] ? params.row.subjectStatList[5].submitRatio : '')
              }
            ]
          },
          {
            title: '政治', align: 'center', ellipsis: true, width: 240,
            children: [
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
                title: '提交', align: 'center', width: 80,
                render: (h, params) => showTip(h, params.row.subjectStatList[7] ? params.row.subjectStatList[7].submitRatio : '')
              }
            ]
          },
          {
            title: '地理', align: 'center', ellipsis: true, width: 240,
            children: [
              {
                title: '提交', align: 'center', width: 80,
                render: (h, params) => showTip(h, params.row.subjectStatList[8] ? params.row.subjectStatList[8].submitRatio : '')
              }
            ]
          },
          {
            title: '统计', align: 'center', ellipsis: true, width: 240,
            children: [
              {
                title: '提交', align: 'center', width: 80,
                render: (h, params) => showTip(h, params.row.totalStat ? params.row.totalStat.submitRatio : '')
              }
            ]
          }
        ],
        params: {
          pageSize: 10,
          pageNum: 1
        },
        paramsStr: null
      }
    },
    methods: {
      download() {
        let access_token = sessionStorage.getItem('accessToken')
        $get(url.downloadClassDetails + this.paramsStr + `&access_token=${access_token}`, {}).then(res => {
          if (res.data) window.open('http://220.248.55.84:8888/' + res.data)
          // if (res.data) window.open(baseUrl.base + '/' + +res.data)
        }).catch(err => console.log(err))
      },
      parse(t) {
        return parseFloat(t) * 100 + '%'
      },
      changePage(n) {
        this.params.pageNum = n
        this.getData()
      },
      setParamsStr() {
        const {gradeId, pageSize, pageNum, startDate, endDate, clazzId} = this.params
        let p = `?pageSize=${pageSize}&pageNum=${pageNum}`
        if (gradeId) p += `&gradeId=${gradeId}`
        if (clazzId) p += `&clazzId=${clazzId}`
        if (startDate) p += `&startDate=${startDate}`
        if (endDate) p += `&endDate=${endDate}`
        this.paramsStr = p
      },
      getData() {
        this.setParamsStr()
        $get(url.overviewClassDetail + this.paramsStr, {}).then(res => {
          if (res.data) {
            const {total, list} = res.data
            this.total = total
            list.forEach(l => {
              const {subjectStatList, totalStat} = l
              if (totalStat.submitRatio != null) totalStat.submitRatio = this.parse(totalStat.submitRatio)
              subjectStatList.forEach(s => {
                if (s.submitRatio != null) s.submitRatio = this.parse(s.submitRatio)
              })
            })
            this.tableData = list
          }
        }).catch(err => console.log(err))
      },
      showModal(params) {
        this.params = params
        this.getData()
        this.addModal = true
      },
      close() {
        this.addModal = false
      }
    },
    // watch: {
    //   addModal(curVal, oldVal) {
    //     if (!curVal) {
    //       this.$refs.form.resetFields()
    //     }
    //   }
    // }
  }
</script>
<style lang="less">
  .radio_len {
    width: 80px;
    text-align: center;
  }
</style>
