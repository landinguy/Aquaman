<template>
  <div class="bg">
    <div class="search-div">
      <div class="search-div-item">
        <label>账单日期</label>
        <DatePicker v-model="params.date" type="date" placeholder="选择日期" class="width"/>
      </div>
      <div class="search-div-item">
        <Button type="primary" @click="search">查询</Button>
        <Button type="ghost" @click="clear" style="margin-left: 16px">清空</Button>
      </div>
    </div>
    <div>
      <Button type="primary" @click="showModal" style="margin-right: 16px">商户对账</Button>
    </div>
    <div style="margin-top: 16px">
      <Table stripe border :columns="columns" :data="tableData"/>
      <!--      <Page :total="total" show-total show-elevator @on-change="changePage" style="margin-top: 16px"/>-->
    </div>
    <Add ref="AddVue"/>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'
  import {showTip, timestampToTime} from '@/libs/util'
  import url from '@/api/url'
  import {$get} from "@/api/ax"
  import Add from "./Add";

  export default {
    name: 'Info',
    data() {
      return {
        params: {
          pageNo: 1, pageSize: 10, date: new Date()
        },
        tableData: [],
        // total: 0,
      }
    },
    components: {Add},
    methods: {
      clear() {
        this.params = {pageNo: 1, pageSize: 10, date: new Date()}
      },
      // changePage(n) {
      //   this.params.pageNo = n;
      //   this.getData();
      // },
      search() {
        // this.params.pageNo = 1;
        this.getData();
      },
      getData() {
        const date = timestampToTime(this.params.date, true);
        $get(url.getBill, {date}).then(res => {
          const {code, msg, data} = res;
          if (code === 0) {
            this.tableData = data;
          } else {
            this.tableData = [];
            this.$Message.warning(`查询账单失败,${msg}`);
          }
        }).catch(err => console.log(err))
      },
      showModal() {
        this.$refs.AddVue.showModal(null);
      }
    },
    mounted() {
      // this.search();
    },
    computed: {
      ...mapGetters(['accountId', 'roleId']),
      columns() {
        const columns = [
          {
            title: '商户id', key: 'outid', align: 'center', ellipsis: true, minWidth: 80,
            render: (h, params) => showTip(h, params.row.outid)
          },
          {
            title: '支付结算中心商户ID', key: 'mid', align: 'center', ellipsis: true, minWidth: 80,
            render: (h, params) => showTip(h, params.row.mid)
          },
          {
            title: '商户名称', key: 'mch_name', align: 'center', ellipsis: true, minWidth: 80,
            render: (h, params) => showTip(h, params.row.mch_name)
          },
          {
            title: '支付金额', key: 'pay_amount', align: 'center', ellipsis: true, minWidth: 80,
            render: (h, params) => showTip(h, params.row.pay_amount)
          },
          {
            title: '支付笔数', key: 'count', align: 'center', ellipsis: true, minWidth: 80,
            render: (h, params) => showTip(h, params.row.count)
          },
          {
            title: '退款金额', key: 'refund_amount', align: 'center', ellipsis: true, minWidth: 80,
            render: (h, params) => showTip(h, params.row.refund_amount)
          },
          {
            title: '退款笔数', key: 'refund_count', align: 'center', ellipsis: true, minWidth: 80,
            render: (h, params) => showTip(h, params.row.refund_count)
          },
          {
            title: '账单日期', key: 'placeddate', align: 'center', ellipsis: true, minWidth: 80,
            render: (h, params) => showTip(h, params.row.placeddate)
          }
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
