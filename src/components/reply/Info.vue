<template>
  <div class="bg">
    <template v-if="content===1">
      <!--      <div class="search-div">-->
      <!--        <div class="search-div-item">-->
      <!--          <label>题型</label>-->
      <!--          <Select v-model="params.type" class="width">-->
      <!--            <Option value="1">选择题</Option>-->
      <!--            <Option value="2">判断题</Option>-->
      <!--            <Option value="3">填空题</Option>-->
      <!--          </Select>-->
      <!--        </div>-->
      <!--        <div class="search-div-item">-->
      <!--          <label>难度系数</label>-->
      <!--          <Input v-model="params.difficulty" placeholder="请输入难度系数" class="width"/>-->
      <!--        </div>-->
      <!--        <div class="search-div-item">-->
      <!--          <Button type="primary" @click="search">查询</Button>-->
      <!--          <Button type="ghost" @click="clear" style="margin-left: 16px">清空</Button>-->
      <!--        </div>-->
      <!--      </div>-->

      <div v-if="params.publishId!=null">
        <!--<br>-->
        <Button type="primary" @click="goBack">返回</Button>
        <Button type="primary" @click="analysis">班级答题分析</Button>
      </div>
      <div style="margin-top: 16px">
        <Table stripe border :columns="columns" :data="tableData"></Table>
        <Page :total="total" show-total show-elevator @on-change="changePage" style="margin-top: 16px"></Page>
      </div>
    </template>
    <template v-if="content===2">
      <Button type="ghost" @click="back" style="margin-left: 16px">返回</Button>
      <Paper :paper-id="paperId" :title="title" :questions="questions" operation="viewAnswer"/>
    </template>
    <Modal v-model="isShow" width="640">
      <p slot="header" style="text-align:center">
        <span>各班级答题结果分析</span>
      </p>
      <div class="analysis" style="margin-bottom: 16px" v-for="item in analysisData">
        <h3>班级名称：{{item.className}}</h3>
        <p>班级总人数：{{item.total}}</p>
        <P>未答题学生：{{item.students.join(",")}}</P>
        <P>简单题结果分析：掌握较差{{item.easy.bad}}人；掌握一般{{item.easy.normal}}人；掌握很好{{item.easy.good}}人；</P>
        <P>中等难度题结果分析：掌握较差{{item.medium.bad}}人；掌握一般{{item.medium.normal}}人；掌握很好{{item.medium.good}}人；</P>
        <P>较难题结果分析：掌握较差{{item.difficult.bad}}人；掌握一般{{item.difficult.normal}}人；掌握很好{{item.difficult.good}}人；</P>
        <p>
          改班级针对较为容易知识<span>{{graspingState(item.easy)}}</span>；中等难度知识<span>{{graspingState(item.medium)}}</span>；较难题<span>{{graspingState(item.difficult)}}</span>
        </p>
      </div>
      <div slot="footer" style="text-align: center">
        <Button type="ghost" shape="circle" class="radio_len" @click="close">关闭</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'
  import {showTip} from '@/libs/util'
  import url from '@/api/url'
  import {$get, post} from "@/api/ax"
  import Paper from '../paper/Paper'

  export default {
    name: 'Info',
    data() {
      return {
        content: 1,
        params: {
          publishId: null, pageNo: 1, pageSize: 10
        },
        tableData: [],
        total: 0,
        paperId: null,
        questions: [],
        title: '',
        isShow: false,
        analysisData: []
      }
    },
    components: {Paper},
    methods: {
      graspingState(obj) {
        const {bad, normal, good} = obj;
        if (good >= normal && good >= bad) return "掌握很好";
        if (normal > good && normal >= bad) return "掌握一般";
        if (bad > normal && bad > good) return "掌握较差";
      },
      close() {
        this.isShow = false;
      },
      analysis() {
        $get(url.analysisReply + this.params.publishId, null).then(res => {
          this.analysisData = res.data;
          this.isShow = true;
        }).catch(err => console.log(err))
      },
      goBack() {
        window.history.back(-1);
      },
      back() {
        this.content = 1;
      },
      clear() {
        this.params = {pageNo: 1, pageSize: 10}
      },
      changePage(n) {
        this.params.pageNo = n;
        this.getData();
      },
      search() {
        this.params.pageNo = 1;
        this.getData();
      },
      getData() {
        post(url.getReply, this.params).then(res => {
          const {total, list} = res.data;
          this.tableData = list;
          this.total = total;
        }).catch(err => console.log(err))
      },
      toPaperPage() {
        this.content = 2
      },
      getPaper(paperId, answer) {
        post(url.getPaperById + paperId, {}).then(res => {
          const {examinations, title} = res.data;
          this.title = title;
          let parse = JSON.parse(answer);
          examinations.forEach(it => it.reply = parse[it.id]);
          this.questions = examinations;
          this.content = 2;
        }).catch(err => console.log(err));
      }
    },
    mounted() {
      let {publishId} = this.$route.params;
      if (publishId) this.params.publishId = publishId;
      this.search();
    },
    computed: {
      ...mapGetters(['accountId', 'roleId']),
      columns() {
        const columns = [
          {
            title: '序号', type: 'index', width: 80, align: 'center'
          },
          {
            title: '试卷名称', key: 'title', align: 'center', ellipsis: true, minWidth: 80,
            render: (h, params) => showTip(h, params.row.title)
          },
          {
            title: '试卷总分', key: 'totalScore', align: 'center', ellipsis: true, minWidth: 80,
            render: (h, params) => showTip(h, params.row.totalScore)
          },
          {
            title: '答题人', key: 'username', align: 'center', ellipsis: true, minWidth: 80,
            render: (h, params) => showTip(h, params.row.username)
          },
          {
            title: '答题得分', key: 'score', align: 'center', ellipsis: true, minWidth: 80,
            render: (h, params) => showTip(h, params.row.score)
          },
          {
            title: '正确题数', key: 'correctNum', align: 'center', ellipsis: true, minWidth: 80,
            render: (h, params) => showTip(h, params.row.correctNum, 'green')
          },
          {
            title: '错误题数', key: 'errorNum', align: 'center', ellipsis: true, minWidth: 80,
            render: (h, params) => showTip(h, params.row.errorNum, 'red')
          },
          {
            title: '答题时间', key: 'submitTs', align: 'center', ellipsis: true, minWidth: 80,
            render: (h, params) => showTip(h, params.row.submitTs)
          },
          {
            title: '操作', align: 'center', width: 150,
            render: (h, params) => {
              const {paperId, answer, endTs} = params.row;
              const view = h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => {
                    let now = new Date();
                    if (now <= new Date(endTs) && this.roleId === 'STUDENT') {
                      this.$Message.warning(`答题截止时间：${endTs},请在截止时间后查看！`);
                    } else {
                      this.paperId = paperId;
                      this.getPaper(paperId, answer);
                    }
                  }
                }
              }, '详情');
              // const edit = h('Button', {
              //   props: {
              //     type: 'primary',
              //     size: 'small'
              //   },
              //   on: {
              //     click: () => {
              //       this.$refs.AddVue.showModal(params.row);
              //     }
              //   }
              // }, '修改');
              // const del = h('Button', {
              //   props: {
              //     type: 'error',
              //     size: 'small'
              //   },
              //   style: {
              //     "margin-left": '5px'
              //   },
              //   on: {
              //     click: () => {
              //       this.$Modal.confirm({
              //         title: '删除',
              //         content: '确认删除该题目？',
              //         onOk: () => {
              //           $get(url.deleteExamination + id, {}).then(res => {
              //             if (res.code == 0) {
              //               this.$Message.success({
              //                 content: '已删除',
              //                 duration: 1,
              //                 onClose: () => this.search()
              //               });
              //             } else {
              //               this.$Message.error('删除失败');
              //             }
              //           });
              //         }
              //       });
              //     }
              //   }
              // }, '删除');
              const op = [];
              op.push(view)
              // if (this.roleId === 'ADMIN' || this.roleId === 'TEACHER' || this.roleId === 'COMPANY') {
              //   op.push(edit);
              //   op.push(del);
              // }
              return h('div', op);
            }
          }
        ];
        // if (this.roleId === 'STUDENT' || this.roleId === 'INTERVIEWER') {
        //   columns.splice(5, 1)
        // }
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
    padding: 16px;
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

  .radio_len {
    width: 80px;
    text-align: center;
  }

  .analysis {
    margin-bottom: 16px;

    span {
      color: red;
    }
  }
</style>
