<template>
  <div class="bg">
    <template v-if="content===1">
      <div v-if="roleId==='ADMIN' || roleId==='TEACHER'">
        <!--<br>-->
        <Button type="primary" @click="showModal">
          <Icon type="plus"></Icon>
          创建班级
        </Button>
      </div>
      <div style="margin-top: 16px">
        <Table stripe border :columns="columns" :data="tableData"></Table>
        <!--      <Page :total="total" show-total show-elevator @on-change="changePage" style="margin-top: 16px"></Page>-->
      </div>
    </template>
    <template v-if="content===2">
      <Button type="ghost" shape="circle" class="radio_len" @click="back" style="margin-left: 16px">返回</Button>
      <StudentInfo ref="StudentInfoVue"/>
    </template>
    <Add ref="AddVue"/>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'
  import {showTip} from '@/libs/util'
  import url from '@/api/url'
  import {get} from "@/api/ax"
  import Add from "./Add";
  import StudentInfo from "./StudentInfo";

  export default {
    name: 'Info',
    data() {
      return {
        params: {
          pageNo: 1, pageSize: 10
        },
        tableData: [],
        total: 0,
        content: 1
      }
    },
    components: {Add, StudentInfo},
    methods: {
      back() {
        this.content = 1;
      },
      showModal() {
        this.$refs.AddVue.showModal(null);
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
        get(url.getClass, {}).then(res => {
          this.tableData = res.data;
        }).catch(err => console.log(err))
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
            title: '班级名称', key: 'classname', align: 'center', ellipsis: true, minWidth: 80,
            render: (h, params) => showTip(h, params.row.classname)
          },
          {
            title: '操作', align: 'center', width: 150,
            render: (h, params) => {
              const {id} = params.row;
              const view = h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.content = 2;
                    setTimeout(() => this.$refs.StudentInfoVue.getData(id), 100)
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

  .radio_len {
    width: 80px;
    text-align: center;
  }

  .width {
    width: 160px;
    margin-right: 32px;
  }
</style>
