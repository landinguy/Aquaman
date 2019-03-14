<template>
  <div class="bg">
    <div v-if="content==2">
      <Add></Add>
    </div>
    <div v-if="content==1">
      <div class="sub">
        <div class="sel">
          <label>姓名</label>
          <Input v-model="params.find" placeholder="快速查找" class="width"/>
        </div>
        <div class="sel">
          <Button type="primary" @click="search">查询</Button>
        </div>
        <div style="clear: left"></div>
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
  import {post, $del, get} from "@/api/ax"
  import Add from './Add'

  export default {
    name: 'TeacherList',
    data() {
      return {
        content: 1,
        params: {find: '', pageNo: 1, pageSize: 10},
        tableData: [],
        total: 0
      }
    },
    components: {Add},
    methods: {
      changePage(n) {
        this.params.pageNo = n;
        this.getData();
      },
      search() {
        this.params.pageNo = 1;
        this.getTotal();
        this.getData();
      },
      getData() {
        post(url.getAccounts, this.params).then(res => this.tableData = res.data).catch(err => console.log(err))
      },
      toCreatePage() {
        this.$router.push({name: 'addAccount'})
      },
      getTotal() {
        const {find} = this.params;
        post(url.getAccountCount, {find}).then(res => this.total = res.data).catch(err => console.log(err))
      }
    },
    mounted() {
      // this.getTotal();
      // this.getData();
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
            title: '角色', key: 'role', align: 'center', ellipsis: true, minWidth: 150,
            render: (h, params) => showTip(h, params.row.role)
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
            title: '班级', key: 'class', align: 'center', ellipsis: true, minWidth: 150,
            render: (h, params) => showTip(h, params.row.class)
          },
          // {
          //   title: '操作',
          //   align: 'center',
          //   width: 200,
          //   render: (h, params) => {
          //     const id = params.row.id;
          //     const $vue = this;
          //     const status = params.row.status;
          //     const dynamic = params.row.dynamic;
          //     const view = h('Button', {
          //       props: {
          //         type: 'primary',
          //         size: 'small'
          //       },
          //       on: {
          //         click: function () {
          //           $vue.setOperation('view');
          //           $vue.setId(id);
          //           $vue.content = 2;
          //         }
          //       },
          //     }, '查看');
          //     const copy = h('Button', {
          //       props: {
          //         type: 'info',
          //         size: 'small'
          //       },
          //       style: {
          //         "margin-left": '5px'
          //       },
          //       on: {
          //         click: function () {
          //           $vue.setOperation('copy');
          //           $vue.setId(id);
          //           $vue.content = 2;
          //         }
          //       }
          //     }, '复制');
          //     const edit = h('Button', {
          //       props: {
          //         type: 'info',
          //         size: 'small'
          //       },
          //       style: {
          //         "margin-left": '5px'
          //       },
          //       on: {
          //         click: function () {
          //           $vue.setOperation('modify');
          //           $vue.setId(id);
          //           $vue.content = 2;
          //         }
          //       }
          //     }, '修改');
          //     const del = h('Button', {
          //       props: {
          //         type: 'error',
          //         size: 'small'
          //       },
          //       style: {
          //         "margin-left": '5px'
          //       },
          //       on: {
          //         click: function () {
          //           $vue.$Modal.confirm({
          //             title: '删除',
          //             content: '确认删除该模板？',
          //             onOk() {
          //               $del(url.delTmpl + id, {accountId: this.accountId}).then(res => {
          //                 if (res.code == 0) {
          //                   $vue.$Message.success({
          //                     content: '已删除',
          //                     duration: 1,
          //                     onClose() {
          //                       $vue.search();
          //                     }
          //                   });
          //                 } else {
          //                   $vue.$Message.error('删除失败');
          //                 }
          //               });
          //             }
          //           });
          //         }
          //       }
          //     }, '删除');
          //     const op = [];
          //     op.push(view);
          //     if (this.roleId == 1) {
          //       op.push(del);
          //       if (status == 'AUDIT_PASS' || status == 'OBSOLETED' || status == 'AUDITING') op.push(copy);
          //       if (status == 'AUDITING' || status == 'AUDIT_FAILED') op.push(edit);
          //     }
          //     return h('div', op);
          //   }
          // }
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

  .sub {
    width: 100%;
    background-color: white;
  }

  .sel {
    margin-top: 4px;
    padding-bottom: 4px;
    float: left;
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
