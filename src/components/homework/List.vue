<template>
  <div class="bg">
    <div class="search-div">
      <div class="search-div-item">
        <label>年份</label>
        <Select v-model="params.year" class="width">
          <Option v-for="item in years" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div class="search-div-item">
        <label>省份</label>
        <Select v-model="params.provinceId" class="width">
          <Option v-for="item in provinces" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
    </div>
    <div class="search-div">
      <div class="search-div-item">
        <label>年级</label>
        <Select v-model="params.gradeId" class="width" @on-change="getSubjects">
          <Option v-for="item in grades" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div class="search-div-item">
        <label>科目</label>
        <Select v-model="params.subjectId" class="width" @on-change="getType">
          <Option v-for="item in subjectData" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div class="search-div-item">
        <label>类型</label>
        <Select v-model="params.paperType" class="width">
          <Option v-for="item in types" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div class="search-div-item">
        <Button type="primary" @click="search">查询</Button>
      </div>
    </div>

    <!--<div v-if="roleId=='ADMIN'">-->
    <!--<Button type="primary" @click="showModal">-->
    <!--<Icon type="plus"></Icon>-->
    <!--添加-->
    <!--</Button>-->
    <!--</div>-->
    <div style="margin-top: 8px">
      <Table stripe border :columns="columns" :data="tableData"></Table>
      <Page :total="total" show-total show-elevator @on-change="changePage" style="margin-top: 16px"></Page>
    </div>
    <Add ref="AddVue"></Add>
  </div>
</template>
<script>
  import {mapMutations, mapGetters} from 'vuex'
  import {showTip, timestampToTime} from '@/libs/util'
  import url from '@/api/url'
  import {post, get, $del, $get, put} from "@/api/ax"
  import Add from './Add.vue'

  export default {
    name: 'List',
    data() {
      return {
        params: {year: '', provinceId: '', gradeId: '', paperType: '', pageIndex: 1, subjectId: ''},
        columns: [
          {
            title: '序号', type: 'index', width: 80, align: 'center'
          },
          {
            title: '类型', key: 'typeName', align: 'center', ellipsis: true, minWidth: 100,
            render: (h, params) => showTip(h, params.row.typeName)
          },
          {
            title: '标题', key: 'title', align: 'center', ellipsis: true, minWidth: 100,
            render: (h, params) => showTip(h, params.row.title)
          },
          {
            title: '题数', key: 'questionCnt', align: 'center', ellipsis: true, width: 80,
            render: (h, params) => showTip(h, params.row.questionCnt)
          },
          {
            title: '时间', key: 'time', align: 'center', ellipsis: true, minWidth: 100,
            render: (h, params) => showTip(h, timestampToTime(params.row.time))
          },
          {
            title: '操作', align: 'center', width: 80,
            render: (h, params) => {
              const {id} = params.row
              const view = h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  "margin-left": '5px'
                },
                on: {
                  click: () => {
                    this.$refs.AddVue.showModal(id)
                  }
                }
              }, '查看')
              const op = []
              op.push(view)
              return h('div', op)
            }
          }
        ],
        tableData: [], years: [], provinces: [], grades: [], types: [], subjectData: [],
        stageId: '',
        total: 0
      }
    },
    components: {Add},
    methods: {
      changePage(n) {
        this.params.pageIndex = n
        this.getData()
      },
      getType() {
        this.params.paperType = ''
        this.types = []
        const {subjectId} = this.params
        if (subjectId) {
          this.types.push({label: '全部', value: 0})
          $get(url.type, {subjectId}).then(res =>
            res.data.forEach(item => this.types.push({label: item.name, value: item.id}))
          ).catch(err => console.log(err))
        }
      },
      getSubjects() {
        const {gradeId} = this.params
        for (let item of this.grades) {
          if (item.value == gradeId) {
            if (this.stageId == item.stageId) {
              return
            } else {
              this.stageId = item.stageId
              this.params.subjectId = ''
              this.params.paperType = ''
              this.subjectData = []
              this.types = []
              get(url.getSubjectByStageId + item.stageId, {}).then(res => {
                if (res) {
                  let subjectList = res.data.subjectList
                  subjectList.forEach(item => this.subjectData.push({label: item.name, value: item.id}))
                }
              }).catch(err => console.log(err))
              break
            }
          }
        }
      },
      showModal() {
        this.$refs.AddVue.showModal(null)
      },
      getData() {
        $get(url.examPapers, this.params).then(res => this.tableData = res.data).catch(err => console.log(err))
      },
      search() {
        const {gradeId, paperType, subjectId} = this.params
        console.log(this.params);
        if (!gradeId) {
          this.$Message.warning('请选择年级')
          return
        }
        if (!subjectId) {
          this.$Message.warning('请选择科目')
          return
        }
        if (paperType === '' || paperType === undefined) {
          this.$Message.warning('请选择试卷类型')
          return
        }
        this.params.pageIndex = 1
        this.getData()
      },
      getSomeData() {
        $get(url.year, {}).then(res => {
          res.data.forEach(item => this.years.push({label: item.name, value: item.id}))
          this.params.year = 2019
        }).catch(err => console.log(err))
        $get(url.grade, {}).then(res => {
          res.data.forEach(item => {
            const {gradeList, stageId} = item
            gradeList.forEach(item => this.grades.push({label: item.name, value: item.id, stageId: stageId}))
          })
        }).catch(err => console.log(err))
        $get(url.province, {}).then(res => {
          res.data.forEach(item => this.provinces.push({label: item.name, value: item.id}))
          this.params.provinceId = 0
        }).catch(err => console.log(err))
      }
    },
    mounted() {
      // this.search()
      this.getSomeData()
    },
    computed: {
      ...mapGetters(['accountId', 'roleId'])
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
