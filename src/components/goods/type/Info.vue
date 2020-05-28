<template>
  <div class="bg">
    <div>
      <Button type="primary" @click="showModal">添加</Button>
    </div>
    <div style="margin-top: 16px">
      <Table stripe border :columns="columns" :data="tableData"></Table>
      <!--      <Page :total="total" show-total show-elevator @on-change="changePage" style="margin-top: 16px"></Page>-->
    </div>
    <Add ref="AddVue"></Add>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'
  import {showTip} from '@/libs/util'
  import url from '@/api/url'
  import {$get} from "@/api/ax"
  import Add from './Add'

  export default {
    name: 'Info',
    data() {
      return {
        params: {
          // pageNo: 1, pageSize: 10
        },
        tableData: [],
        // total: 0,
      }
    },
    components: {Add},
    methods: {
      // clear() {
      //   this.params = {pageNo: 1, pageSize: 10}
      // },
      // changePage(n) {
      //   this.params.pageNo = n;
      //   this.getData();
      // },
      search() {
        // this.params.pageNo = 1;
        this.getData();
      },
      getData() {
        $get(url.getGoodsType, {}).then(res => {
          const {data} = res;
          this.tableData = data;
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
            title: '类别id', key: 'id', align: 'center', ellipsis: true, minWidth: 80,
            render: (h, params) => showTip(h, params.row.id)
          },
          {
            title: '类别名称', key: 'name', align: 'center', ellipsis: true, minWidth: 80,
            render: (h, params) => showTip(h, params.row.name)
          },
          // {
          //   title: '操作', align: 'center', width: 180,
          //   render: (h, params) => {
          //     const {id, url} = params.row;
          //     const del = h('Button', {
          //       props: {
          //         type: 'error',
          //         size: 'small'
          //       },
          //       style: {
          //         "margin-left": '5px'
          //       },
          //       on: {
          //         click: () => {
          //           this.$Modal.confirm({
          //             title: '删除',
          //             content: '确认删除该文件？',
          //             onOk: () => this.deleteFile(id)
          //           });
          //         }
          //       }
          //     }, '删除');
          //     const op = [];
          //     // if (this.roleId === 'ADMIN' || this.roleId === 'TEACHER' || this.roleId === 'COMPANY') {
          //     op.push(download);
          //     op.push(share);
          //     op.push(del);
          //     // }
          //     return h('div', op);
          //   }
          // }
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
