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

    <div v-if="roleId==='ADMIN' || roleId==='POLICEMAN'">
      <!--<br>-->
      <Button type="primary" @click="showModal">
        <Icon type="plus"></Icon>
        添加违章记录
      </Button>
      <Button type="primary" @click="showBatchModal">
        <Icon type="plus"></Icon>
        批量操作
      </Button>
    </div>
    <div style="margin-top: 16px">
      <Table stripe border :columns="columns" :data="tableData"></Table>
      <Page :total="total" show-total show-elevator @on-change="changePage" style="margin-top: 16px"></Page>
    </div>
    <Add ref="AddVue"></Add>
    <Batch ref="BatchVue"></Batch>
  </div>
</template>
<script>
  import {mapMutations, mapGetters} from 'vuex'
  import {showTip, timestampToTime} from '@/libs/util'
  import url from '@/api/url'
  import {post, $del, get, $get, patch} from "@/api/ax"
  import Add from './Add'
  import Batch from '../vehicle/Batch'

  export default {
    name: 'Info',
    data() {
      return {
        content: 1,
        params: {name: '', type: '', pageNo: 1, pageSize: 10},
        tableData: [],
        total: 0
      }
    },
    components: {Add, Batch},
    methods: {
      clear() {
        this.params = {name: '', type: '', pageNo: 1, pageSize: 10}
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
        let params = this.params;
        if (this.roleId === 'USER') params.uid = this.accountId;

        post(url.getRecord, this.params).then(res => {
          const {total, list} = res.data;
          this.tableData = list;
          this.total = total;
        }).catch(err => console.log(err))
      },
      showModal() {
        this.$refs.AddVue.showModal(null);
      },
      showBatchModal() {
        this.$refs.BatchVue.showModal('peccancy');
      }
    },
    mounted() {
      this.search();
      this.$refs.AddVue.getAccount();
    },
    computed: {
      ...mapGetters(['accountId', 'roleId']),
      columns() {
        const columns = [
          {
            title: '序号', type: 'index', width: 80, align: 'center'
          },
          {
            title: '车主', key: 'username', align: 'center', ellipsis: true, minWidth: 100,
            render: (h, params) => showTip(h, params.row.username)
          },
          {
            title: '车牌号', key: 'plateNumber', align: 'center', ellipsis: true, minWidth: 100,
            render: (h, params) => showTip(h, params.row.plateNumber)
          },
          {
            title: '违章原因', key: 'reason', align: 'center', ellipsis: true, minWidth: 100,
            render: (h, params) => showTip(h, params.row.reason)
          },
          {
            title: '违章时间', key: 'time', align: 'center', ellipsis: true, minWidth: 150,
            render: (h, params) => showTip(h, timestampToTime(parseInt(params.row.time)))
          },
          {
            title: '罚款金额', key: 'fine', align: 'center', ellipsis: true, minWidth: 100,
            render: (h, params) => showTip(h, params.row.fine)
          },
          {
            title: '是否已缴罚款', key: 'paymentStatus', align: 'center', ellipsis: true, minWidth: 150,
            render: (h, params) => {
              let text = params.row.paymentStatus == 0 ? '未缴' : '已缴'
              let color = params.row.paymentStatus == 0 ? 'red' : 'green'
              return showTip(h, text, color)
            }
          },
          {
            title: '罚单状态', key: 'status', align: 'center', ellipsis: true, minWidth: 100,
            render: (h, params) => {
              let text = params.row.status == 0 ? '未关闭' : '已关闭'
              let color = params.row.status == 0 ? 'red' : 'green'
              return showTip(h, text, color)
            }
          },
          // {
          //   title: '备注', key: 'description', align: 'center', ellipsis: true, minWidth: 100,
          //   render: (h, params) => showTip(h, params.row.description)
          // },
          {
            title: '操作', align: 'left', width: 150,
            render: (h, params) => {
              const {id, type, status, paymentStatus} = params.row;
              const close = h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  "margin-left": '5px'
                },
                on: {
                  click: () => {
                    let text = '确认关闭该记录？'
                    this.$Modal.confirm({
                      title: '关闭',
                      content: paymentStatus == 0 ? `车主还未缴纳罚款，${text}` : text,
                      onOk: () => {
                        $get(url.closeRecord, {id}).then(res => {
                          if (res.code == 0) {
                            this.$Message.success({
                              content: '已关闭',
                              duration: 1,
                              onClose: () => this.search()
                            });
                          } else {
                            this.$Message.error('关闭失败');
                          }
                        });
                      }
                    });
                  }
                }
              }, '关闭');
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
                      content: '确认删除该记录？',
                      onOk: () => {
                        $get(url.deleteRecord, {id}).then(res => {
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
              const pay = h('Button', {
                props: {
                  type: 'info',
                  size: 'small'
                },
                style: {
                  // "margin-left": '5px'
                },
                on: {
                  click: () => {
                    $get(url.pay, {id}).then(res => {
                      if (res.code == 0) {
                        this.$Message.success({
                          content: '缴纳成功',
                          duration: 1,
                          onClose: () => this.search()
                        });
                      } else {
                        this.$Message.error('缴纳失败');
                      }
                    });
                  }
                }
              }, '缴罚款');
              const op = [];
              // op.push(view);
              if (this.roleId === 'ADMIN' || this.roleId === 'JGS') {
                // op.push(edit);
                if (status == 0) op.push(close)
              }

              if (this.roleId === 'ADMIN') op.push(del)

              if (this.roleId === 'USER' && paymentStatus == 0) op.push(pay)

              if (op.length == 0) op.push(h('div', '----'))
              return h('div', op);
            }
          }
        ];
        if (this.roleId === 'POLICEMAN') columns.splice(8, 1)
        if (this.roleId === 'USER') columns.splice(1, 1)

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
