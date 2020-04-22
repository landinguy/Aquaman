<template>
  <div class="bg">
    <template v-if="content===1">
      <div class="search-div">
        <div class="search-div-item">
          <label>题型</label>
          <Select v-model="params.type" class="width">
            <Option value="1">选择题</Option>
            <Option value="2">判断题</Option>
            <Option value="3">填空题</Option>
          </Select>
        </div>
        <div class="search-div-item">
          <label>难度系数</label>
          <Input v-model="params.difficulty" placeholder="请输入难度系数" class="width"/>
        </div>
        <div class="search-div-item">
          <Button type="primary" @click="search">查询</Button>
          <Button type="ghost" @click="clear" style="margin-left: 16px">清空</Button>
        </div>
      </div>
      <div v-if="roleId==='ADMIN' || roleId==='TEACHER' || roleId==='COMPANY'">
        <!--<br>-->
        <Button type="primary" @click="showModal">
          <Icon type="plus"></Icon>
          录入题库
        </Button>
        <Button type="primary" @click="toPaperPage">
          <Icon type="eye"></Icon>
          试卷预览
        </Button>
      </div>
      <div style="margin-top: 16px">
        <Table stripe border :columns="columns" :data="tableData" @on-select-cancel="onCancel"
               @on-selection-change="changeSelection"></Table>
        <Page :total="total" show-total show-elevator @on-change="changePage" style="margin-top: 16px"></Page>
      </div>
      <Add ref="AddVue"></Add>
    </template>
    <template v-if="content===2">
      <Button type="ghost" @click="back" style="margin-left: 16px">返回</Button>
      <Paper operation="viewAndSave" :questions="questions"/>
    </template>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'
  import {showTip} from '@/libs/util'
  import url from '@/api/url'
  import {$get, post} from "@/api/ax"
  import Add from './Add'
  import Paper from '../paper/Paper'

  export default {
    name: 'Info',
    data() {
      return {
        content: 1,
        params: {
          type: '', difficulty: '', pageNo: 1, pageSize: 10
        },
        tableData: [],
        total: 0,
        questions: []
      }
    },
    components: {Add, Paper},
    methods: {
      toPaperPage() {
        this.content = 2
      },
      back() {
        this.content = 1;
        this.setCheckedStatus();
      },
      setCheckedStatus() {
        let selected = this.questions.map(it => it.id);
        this.tableData.forEach(it => it._checked = selected.indexOf(it.id) !== -1)

      },
      onCancel(selection, row) {
        this.questions.forEach((it, index) => {
          if (it.id === row.id) this.questions.splice(index, 1)
        });
        this.setCheckedStatus()
      },
      changeSelection(selection) {
        // console.log('-------', JSON.stringify(selection));
        let selected = this.questions.map(it => it.id);
        // console.log('-------', JSON.stringify(selected));
        if (selection.length === 0) {
          this.tableData.forEach(it => this.onCancel(selection, it))
        } else {
          selection.forEach(it => {
            if (selected.indexOf(it.id) === -1) this.questions.push({
              id: it.id, type: it.type,
              content: it.content, difficulty: it.difficulty
            })
          });
        }
      },
      clear() {
        this.params = {type: '', difficulty: '', pageNo: 1, pageSize: 10}
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
        post(url.getExamination, this.params).then(res => {
          const {total, list} = res.data;
          this.tableData = list;
          this.total = total;
          this.setCheckedStatus();
        }).catch(err => console.log(err))
      },
      showModal() {
        this.$refs.AddVue.showModal(null);
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
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '题型', key: 'type', align: 'center', ellipsis: true, minWidth: 80,
            render: (h, params) => {
              const {type} = params.row;
              let text = type == 1 ? '选择题' : type == 2 ? '判断题' : '填空题';
              return showTip(h, text)
            }
          },
          {
            title: '题目内容', key: 'content', align: 'center', ellipsis: true, minWidth: 80,
            render: (h, params) => showTip(h, params.row.content)
          },
          {
            title: '题目答案', key: 'answer', align: 'center', ellipsis: true, minWidth: 80,
            render: (h, params) => showTip(h, params.row.answer)
          },
          {
            title: '难度系数', key: 'difficulty', align: 'center', ellipsis: true, minWidth: 80,
            render: (h, params) => showTip(h, params.row.difficulty)
          },
          {
            title: '操作', align: 'center', width: 150,
            render: (h, params) => {
              const {id} = params.row;
              const edit = h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.$refs.AddVue.showModal(params.row);
                  }
                }
              }, '修改');
              const del = h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  "margin-left": '5px'
                },
                on: {
                  click: () => {
                    this.$Modal.confirm({
                      title: '删除',
                      content: '确认删除该题目？',
                      onOk: () => {
                        $get(url.deleteExamination + id, {}).then(res => {
                          if (res.code == 0) {
                            this.$Message.success({
                              content: '已删除',
                              duration: 1,
                              onClose: () => this.search()
                            });
                          } else {
                            this.$Message.error('删除失败');
                          }
                        });
                      }
                    });
                  }
                }
              }, '删除');
              const op = [];
              if (this.roleId === 'ADMIN' || this.roleId === 'TEACHER' || this.roleId === 'COMPANY') {
                op.push(edit);
                op.push(del);
              }
              return h('div', op);
            }
          }
        ];
        if (this.roleId === 'STUDENT' || this.roleId === 'INTERVIEWER') {
          columns.splice(5, 1)
        }
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
