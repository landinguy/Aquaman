<template>
  <div class="bg">
    <div class="search-div">
      <div class="search-div-item">
        <label>商品名</label>
        <Input v-model="params.goodsName" placeholder="请输入商品名" class="width"/>
      </div>
      <div class="search-div-item">
        <Button type="primary" size="small" @click="search">查询</Button>
        <Button type="ghost" size="small" @click="clear" style="margin-left: 16px">清空</Button>
      </div>
    </div>

    <div>
      <Button type="primary" size="small" @click="showAddGoodsTypeModal">添加商品类别</Button>
      <Button type="primary" size="small" @click="showAddGoodsModal">添加商品</Button>
    </div>
    <div style="margin-top: 16px">
      <Table stripe border :columns="columns" :data="tableData"/>
      <Page :total="total" show-total show-elevator @on-change="changePage" style="margin-top: 16px"/>
    </div>
    <AddGoodsType ref="AddGoodsTypeVue"/>
    <AddGoods ref="AddGoodsVue"/>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'
  import AddGoods from './AddGoods'
  import AddGoodsType from './AddGoodsType'
  import goodsApi from '@/api/goods'
  import {showTip, timestampToTime} from '@/libs/util'

  export default {
    name: 'Info',
    data() {
      return {
        params: {
          pageNo: 1, pageSize: 10, goodsName: ''
        },
        tableData: [],
        total: 0,
        questions: [],
      }
    },
    components: {AddGoods, AddGoodsType},
    methods: {
      clear() {
        this.params = {pageNo: 1, pageSize: 10, goodsName: ''}
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
        goodsApi.getGoods(this.params).then(res => {
          const {total, list} = res.data;
          this.tableData = list;
          this.total = total;
        }).catch(err => console.log(err))
      },
      showAddGoodsTypeModal() {
        this.$refs.AddGoodsTypeVue.showModal(null);
      },
      showAddGoodsModal() {
        this.$refs.AddGoodsVue.showModal(null);
      },
      deleteGoods(id) {
        goodsApi.deleteGoods(id).then(res => {
          if (res.code === 0) {
            this.$Message.success({
              content: '已删除',
              duration: 1,
              onClose: () => this.search()
            });
          } else {
            this.$Message.error('删除失败');
          }
        });
      },
      // download(id) {
      //   window.open(`${baseUrl.base}${url.download}?fid=${id}`)
      // }
    },
    mounted() {
      this.search();
      console.log("tableData", JSON.stringify(this.tableData))
    },
    computed: {
      ...mapGetters(['accountId', 'role']),
      columns() {
        const columns = [
          {
            title: '商品名称', key: 'goodsName', align: 'center', ellipsis: true, minWidth: 80,
            render: (h, params) => showTip(h, params.row.goodsName)
          },
          {
            title: '商品类别', key: 'goodsType', align: 'center', ellipsis: true, minWidth: 80,
            render: (h, params) => showTip(h, params.row.goodsType)
          },
          {
            title: '商品价格（元）', key: 'price', align: 'center', ellipsis: true, minWidth: 80,
            render: (h, params) => showTip(h, params.row.price)
          },
          {
            title: '创建时间', key: 'date', align: 'center', ellipsis: true, minWidth: 80,
            render: (h, params) => showTip(h, timestampToTime(params.row.date))
          },
          {
            title: '操作', align: 'center', width: 180,
            render: (h, params) => {
              const {id} = params.row;
              const edit = h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  // "margin-left": '5px'
                },
                on: {
                  click: () => {
                    this.$refs.AddGoodsVue.showModal(params.row);
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
                      content: '确认删除该商品？',
                      onOk: () => this.deleteGoods(id)
                    });
                  }
                }
              }, '删除');
              const op = [];
              op.push(edit);
              op.push(del);
              return h('div', op);
            }
          }
        ];
        return columns
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
