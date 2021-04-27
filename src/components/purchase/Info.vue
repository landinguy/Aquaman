<template>
  <div class="bg">
    <!--<div class="search-div">-->
    <!--<div class="search-div-item">-->
    <!--<label>姓名</label>-->
    <!--<Input v-model="params.nickname" placeholder="请输入姓名" class="width"/>-->
    <!--</div>-->
    <!--<div class="search-div-item">-->
    <!--<label>账号</label>-->
    <!--<Input v-model="params.username" placeholder="请输入账号" class="width"/>-->
    <!--</div>-->
    <!--<div class="search-div-item">-->
    <!--<Button type="primary" @click="search">查询</Button>-->
    <!--<Button type="ghost" @click="clear" style="margin-left: 16px">清空</Button>-->
    <!--</div>-->
    <!--</div>-->

    <div>
      <!--<br>-->
      <Button type="primary" @click="showModal">
        <Icon type="plus"></Icon>
        添加
      </Button>
    </div>
    <div style="margin-top: 16px">
      <Table stripe border :columns="columns" :data="tableData"/>
      <Page :total="total" show-total show-elevator @on-change="changePage" style="margin-top: 16px"/>
    </div>
    <Add ref="AddVue" :goods-type-data="goodsTypeData"/>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'
  import {showTip, timestampToTime} from '@/libs/util'
  import workApi from '@/api/work'
  import goodsApi from '@/api/goods'
  import Add from "./Add"

  export default {
    name: 'Info',
    data() {
      return {
        content: 1,
        params: {
          // username: '', nickname: '',
          pageNo: 1, pageSize: 10
        },
        tableData: [],
        total: 0,
        goodsTypeData: []
      }
    },
    components: {Add},
    methods: {
      clear() {
        this.params = {
          // username: '', nickname: '',
          pageNo: 1, pageSize: 10
        }
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
        workApi.getPurchaseDetail(this.params).then(res => {
          const {total, list} = res.data;
          this.tableData = list;
          this.total = total;
        }).catch(err => console.log(err))
      },
      showModal() {
        this.$refs.AddVue.showModal(null);
      },
      getGoodsType() {
        goodsApi.getGoodsType().then(res => {
          this.goodsTypeData = res.data
        }).finally(err => console.log(err))
      },
    },
    mounted() {
      this.search();
      this.getGoodsType();
    },
    computed: {
      ...mapGetters(['accountId', 'role']),
      columns() {
        const columns = [
          {
            title: '商品名', key: 'goodsName', align: 'center', ellipsis: true, minWidth: 80,
            render: (h, params) => showTip(h, params.row.goodsName)
          },
          {
            title: '商品类别', key: 'goodsType', align: 'center', ellipsis: true, minWidth: 80,
            render: (h, params) => showTip(h, params.row.goodsType)
          },
          {
            title: '采购数量', key: 'purchaseNumber', align: 'center', ellipsis: true, minWidth: 80,
            render: (h, params) => showTip(h, params.row.purchaseNumber)
          },
          {
            title: '生产日期', key: 'productionDate', align: 'center', ellipsis: true, minWidth: 80,
            render: (h, params) => showTip(h, params.row.productionDate)
          },
          {
            title: '采购日期', key: 'date', align: 'center', ellipsis: true, minWidth: 80,
            render: (h, params) => showTip(h, timestampToTime(params.row.date))
          },
          {
            title: '厂家地址', key: 'manufacturerAddress', align: 'center', ellipsis: true, minWidth: 80,
            render: (h, params) => showTip(h, params.row.manufacturerAddress)
          },
          {
            title: '厂家联系方式', key: 'manufacturerPhone', align: 'center', ellipsis: true, minWidth: 80,
            render: (h, params) => showTip(h, params.row.manufacturerPhone)
          },
          // {
          // title: '操作', align: 'center', width: 150,
          // render: (h, params) => {
          //   const id = params.row.id;
          //   const edit = h('Button', {
          //     props: {
          //       type: 'primary',
          //       size: 'small'
          //     },
          //     style: {
          //       "margin-left": '5px'
          //     },
          //     on: {
          //       click: () => {
          //         this.$refs.UpdatePwdVue.showModal(params.row);
          //       }
          //     }
          //   }, '修改密码');
          // const edit = h('Button', {
          //   props: {
          //     type: 'primary',
          //     size: 'small'
          //   },
          //   style: {
          //     "margin-left": '5px'
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
          //         content: '确认删除该用户？',
          //         onOk: () => {
          //           $get(url.deleteAccount, {id}).then(res => {
          //             if (res.code == 0) {
          //               this.$Message.success({
          //                 content: '已删除',
          //                 duration: 1,
          //                 onClose: () => {
          //                   this.search();
          //                 }
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
          //   const op = [];
          //   op.push(edit);
          //   // op.push(del);
          //   return h('div', op);
          // }
          // }
        ];
        // if (this.role != 'ADMIN') {
        //   columns.splice(7, 1)
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
</style>
