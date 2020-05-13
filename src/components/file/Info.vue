<template>
  <div class="bg">

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
    <!--          <label>关键字</label>-->
    <!--          <Input v-model="params.keyword" placeholder="请输入关键字" class="width"/>-->
    <!--        </div>-->
    <!--        <div class="search-div-item">-->
    <!--          <Button type="primary" @click="search">查询</Button>-->
    <!--          <Button type="ghost" @click="clear" style="margin-left: 16px">清空</Button>-->
    <!--        </div>-->
    <!--      </div>-->
    <div>
      <Button type="primary" @click="showModal">上传文件</Button>
    </div>
    <div style="margin-top: 16px">
      <Table stripe border :columns="columns" :data="tableData"></Table>
      <Page :total="total" show-total show-elevator @on-change="changePage" style="margin-top: 16px"></Page>
    </div>
    <Add ref="AddVue"></Add>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'
  import {showTip} from '@/libs/util'
  import url from '@/api/url'
  import {post} from "@/api/ax"
  import Add from './Add'

  export default {
    name: 'Info',
    data() {
      return {
        params: {
          pageNo: 1, pageSize: 10
        },
        tableData: [],
        total: 0,
        questions: []
      }
    },
    components: {Add},
    methods: {
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
        // alert(JSON.stringify(this.params))
        post(url.files, {...this.params, uid: this.accountId}).then(res => {
          const {total, list} = res.data;
          this.tableData = list;
          this.total = total;
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
            title: '文件名', key: 'name', align: 'center', ellipsis: true, minWidth: 80,
            render: (h, params) => showTip(h, params.row.name)
          },
          {
            title: '创建时间', key: 'create_ts', align: 'center', ellipsis: true, minWidth: 80,
            render: (h, params) => showTip(h, params.row.create_ts)
          },
          {
            title: '文件大小（字节）', key: 'size', align: 'center', ellipsis: true, minWidth: 80,
            render: (h, params) => showTip(h, params.row.size)
          },
          {
            title: '加密方式', key: 'encryption_type', align: 'center', ellipsis: true, minWidth: 80,
            render: (h, params) => {
              let type = params.row.encryption_type;
              return showTip(h, type === 1 ? 'Base64' : 'AES')
            }
          },
          {
            title: '操作', align: 'center', width: 150,
            render: (h, params) => {
              const {id} = params.row;
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
              //             if (res.code === 0) {
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
              // const op = [];
              // if (this.roleId === 'ADMIN' || this.roleId === 'TEACHER' || this.roleId === 'COMPANY') {
              //   op.push(edit);
              //   op.push(del);
              // }
              // return h('div', op);
            }
          }
        ];
        // if (this.roleId === 'STUDENT' || this.roleId === 'INTERVIEWER') {
        //   columns.splice(6, 1)
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
