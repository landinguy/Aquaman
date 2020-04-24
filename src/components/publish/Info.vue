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

      <!--      <div v-if="roleId==='ADMIN' || roleId==='TEACHER' || roleId==='COMPANY'">-->
      <!--        &lt;!&ndash;<br>&ndash;&gt;-->
      <!--        <Button type="primary" @click="showModal">-->
      <!--          <Icon type="plus"></Icon>-->
      <!--          录入题库-->
      <!--        </Button>-->
      <!--        <Button type="primary" @click="toPaperPage">-->
      <!--          <Icon type="eye"></Icon>-->
      <!--          试卷预览-->
      <!--        </Button>-->
      <!--      </div>-->
      <div style="margin-top: 16px">
        <Table stripe border :columns="columns" :data="tableData"></Table>
        <Page :total="total" show-total show-elevator @on-change="changePage" style="margin-top: 16px"></Page>
      </div>
    </template>
    <template v-if="content===2">
      <Button type="ghost" @click="back" style="margin-left: 16px"
              v-if="roleId !== 'STUDENT' && roleId !== 'INTERVIEWER'">返回
      </Button>
      <Paper :paper-id="paperId" :publish-id="publishId" :title="title" operation="answer" :questions="questions"
             :answer-ts="answerTs"/>
    </template>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'
  import {showTip} from '@/libs/util'
  import url from '@/api/url'
  import {post} from "@/api/ax"
  import Paper from '../paper/Paper'

  export default {
    name: 'Info',
    data() {
      return {
        content: 1,
        params: {
          pageNo: 1, pageSize: 10
        },
        tableData: [],
        total: 0,
        paperId: null,
        publishId: null,
        questions: [],
        title: '',
        answerTs: null
      }
    },
    components: {Paper},
    methods: {
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
        post(url.publishRecord, this.params).then(res => {
          const {total, list} = res.data;
          this.tableData = list;
          this.total = total;
        }).catch(err => console.log(err))
      },
      toPaperPage() {
        this.content = 2
      },
      getPaper(paperId) {
        post(url.getPaperById + paperId, {}).then(res => {
          const {examinations, title} = res.data;
          this.title = title;
          this.questions = examinations;
          this.content = 2;
        }).catch(err => console.log(err));
      }
    },
    mounted() {
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
            title: '发布人', key: 'username', align: 'center', ellipsis: true, minWidth: 80,
            render: (h, params) => showTip(h, params.row.username)
          },
          {
            title: '答题时间(分钟)', key: 'answerTs', align: 'center', ellipsis: true, minWidth: 80,
            render: (h, params) => showTip(h, params.row.answerTs)
          },
          {
            title: '发布时间', key: 'publishTs', align: 'center', ellipsis: true, minWidth: 80,
            render: (h, params) => showTip(h, params.row.publishTs)
          },
          {
            title: '答题截止时间', key: 'endTs', align: 'center', ellipsis: true, minWidth: 80,
            render: (h, params) => showTip(h, params.row.endTs)
          },
          {
            title: '操作', align: 'center', width: 150,
            render: (h, params) => {
              const {paperId, id, answerTs, endTs} = params.row;
              const answer = h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => {
                    let now = new Date();
                    if (now <= new Date(endTs)) {
                      this.paperId = paperId;
                      this.publishId = id;
                      this.answerTs = answerTs;
                      this.getPaper(paperId);
                    } else {
                      this.$Message.warning('答题时间已过，不能作答！');
                    }
                  }
                }
              }, '答题');

              const view = h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.$router.push({name: 'reply', params: {publishId: id}});
                  }
                }
              }, '答题记录');

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
              if (this.roleId === 'STUDENT' || this.roleId === 'INTERVIEWER') op.push(answer);
              if (this.roleId === 'ADMIN' || this.roleId === 'TEACHER' || this.roleId === 'COMPANY') op.push(view);
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
