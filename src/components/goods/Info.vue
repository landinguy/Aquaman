<template>
  <div class="bg">
    <div class="search-div">
      <div class="search-div-item">
        <label>商品类型</label>
        <Select v-model="params.type" class="width">
          <Option v-for="item in types" :value="item.id" :key="item.id">{{item.name}}</Option>
        </Select>
      </div>
      <div class="search-div-item">
        <Button type="primary" @click="search">查询</Button>
        <Button type="ghost" @click="clear" style="margin-left: 16px">清空</Button>
      </div>
    </div>
    <div>
      <Button type="primary" @click="showModal" v-if="roleId==='ADMIN'" style="margin-right: 16px">添加商品</Button>
      <a @click="showOrderModal">
        <Badge :count="number">
          <Icon type="ios-cart" size="40"/>
        </Badge>
      </a>
    </div>
    <div style="margin-top: 16px">
      <div class="goods">
        <template v-for="item in tableData">
          <Card style="width: 200px">
            <Button type="ghost" shape="circle" icon="plus" size="small" @click="onSelectGoods(item.id)"/>
            <div style="text-align:center">
              <img :src="item.image">
              <h5>{{item.name}}</h5>
            </div>
          </Card>
        </template>
      </div>
      <Page :total="total" show-total show-elevator @on-change="changePage" style="margin-top: 16px"/>
    </div>
    <Add ref="AddVue" :types="types"/>
    <Order ref="OrderVue"/>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'
  import url from '@/api/url'
  import {$get, post} from "@/api/ax"
  import Add from './Add'
  import Order from "./Order"


  export default {
    name: 'Info',
    data() {
      return {
        params: {
          pageNo: 1, pageSize: 10, type: null
        },
        tableData: [],
        total: 0,
        types: [],
        goodsIds: new Set(),
        number: 0
      }
    },
    components: {Add, Order},
    methods: {
      clearGoods() {
        this.goodsIds.clear();
        this.number = 0;
      },
      showOrderModal() {
        let data = this.tableData.filter(it => this.goodsIds.has(it.id));
        // console.log(JSON.stringify(data))
        this.$refs.OrderVue.showModal(data);
      },
      onSelectGoods(id, isAdd = true) {
        if (isAdd) this.goodsIds.add(id);
        else this.goodsIds.delete(id);
        this.number = this.goodsIds.size;
      },
      clear() {
        this.params = {pageNo: 1, pageSize: 10, type: null}
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
        post(url.getGoods, {...this.params}).then(res => {
          const {total, list} = res.data;
          this.tableData = list;
          this.total = total;
        }).catch(err => console.log(err))
      },
      getTypes() {
        $get(url.getGoodsType, {}).then(res => {
          const {data} = res;
          this.types = data;
        }).catch(err => console.log(err))
      },
      showModal() {
        this.$refs.AddVue.showModal(null);
      }
    }
    ,
    mounted() {
      this.getTypes();
      this.search();
    },
    computed: {
      ...mapGetters(['accountId', 'roleId']),
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

  .goods {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;

    img {
      width: 150px;
      height: 150px;
    }

    h5 {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      /*width: 110px;*/
    }
  }
</style>
