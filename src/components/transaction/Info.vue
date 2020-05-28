<template>
  <div class="bg">
    <div class="search-div">
      <div class="search-div-item">
        <label>订单号</label>
        <Input v-model.trim="params.outOrderId" placeholder="请输入订单号" class="width"/>
      </div>
      <div class="search-div-item">
        <label>订单金额</label>
        <Input v-model.trim="params.outOrderAmount" placeholder="请输入订单金额" class="width"/>
      </div>
      <div class="search-div-item">
        <Button type="primary" @click="search">查询</Button>
        <Button type="ghost" @click="clear" style="margin-left: 16px">清空</Button>
      </div>
    </div>
    <div style="margin-top: 16px">
      <template v-if="info===''">
        暂无交易信息！
      </template>
      <template v-else>
        <h3>交易信息：</h3><br>
        <p>{{info}}</p>
      </template>
    </div>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'
  import url from '@/api/url'
  import {$get} from "@/api/ax"

  export default {
    name: 'Info',
    data() {
      return {
        params: {
          // pageNo: 1, pageSize: 10,
          outOrderId: '', outOrderAmount: ''
        },
        info: '',
      }
    },
    components: {},
    methods: {
      clear() {
        this.params = {pageNo: 1, pageSize: 10, outOrderId: '', outOrderAmount: ''}
      },
      search() {
        const {outOrderId, outOrderAmount} = this.params;
        if (outOrderId === '') {
          this.$Message.warning('订单号不能为空');
          return
        }
        if (outOrderAmount === '') {
          this.$Message.warning('订单金额不能为空');
          return
        }
        this.getData();
      },
      getData() {
        $get(url.getTransaction, {...this.params}).then(res => {
          const {code, msg, data} = res;
          if (code === 0) {
            this.info = data;
          } else {
            this.$Message.warning(msg);
          }
        }).catch(err => console.log(err))
      }
    },
    mounted() {
      // this.search();
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
