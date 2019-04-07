<template>
  <div class="bg">
    <div class="search-div">
      <div class="search-div-item">
        <label>车主姓名</label>
        <Input v-model="params.nickname" placeholder="请输入车主姓名" class="width"/>
      </div>
      <div class="search-div-item">
        <label>车牌号</label>
        <Input v-model="params.plateNumber" placeholder="请输入车牌号" class="width"/>
      </div>
      <div class="search-div-item">
        <label>车辆类型</label>
        <Select v-model="params.type" class="width">
          <Option value="1">电动车</Option>
          <Option value="2">小汽车</Option>
          <Option value="3">小型客车</Option>
          <Option value="4">大型客车</Option>
        </Select>
      </div>
      <div class="search-div-item">
        <Button type="primary" @click="search">查询</Button>
        <Button type="ghost" @click="clear" style="margin-left: 16px">清空</Button>
      </div>
    </div>

    <div v-if="roleId==='ADMIN' || roleId==='JGS'">
      <!--<br>-->
      <Button type="primary" @click="showModal">
        <Icon type="plus"></Icon>
        添加车辆
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
  import Batch from './Batch'

  export default {
    name: 'Info',
    data() {
      return {
        content: 1,
        params: {nickname: '', plateNumber: '', type: '', pageNo: 1, pageSize: 10},
        tableData: [],
        total: 0
      }
    },
    components: {Add, Batch},
    methods: {
      clear() {
        this.params = {nickname: '', plateNumber: '', type: '', pageNo: 1, pageSize: 10}
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

        post(url.getVehicle, this.params).then(res => {
          const {total, list} = res.data;
          this.tableData = list;
          this.total = total;
        }).catch(err => console.log(err))
      },
      showModal() {
        this.$refs.AddVue.showModal(null);
      },
      showBatchModal() {
        this.$refs.BatchVue.showModal('vehicle');
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
            title: '车辆名', key: 'name', align: 'center', ellipsis: true, minWidth: 80,
            render: (h, params) => showTip(h, params.row.name)
          },
          {
            title: '车牌号', key: 'plateNumber', align: 'center', ellipsis: true, minWidth: 80,
            render: (h, params) => showTip(h, params.row.plateNumber)
          },
          {
            title: '车辆类型', key: 'type', align: 'center', ellipsis: true, minWidth: 80,
            render: (h, params) => {
              const {type} = params.row;
              let text = type == 1 ? '电动车' : type == 2 ? '小汽车' : type == 3 ? '小客车' : '大客车'
              return showTip(h, text)
            }
          },
          {
            title: '购买时间', key: 'buyTs', align: 'center', ellipsis: true, minWidth: 120,
            render: (h, params) => showTip(h, timestampToTime(parseInt(params.row.buyTs), 'date'))
          },
          {
            title: '所属车主', key: 'username', align: 'center', ellipsis: true, minWidth: 80,
            render: (h, params) => showTip(h, params.row.username)
          },
          {
            title: '备注', key: 'description', align: 'center', ellipsis: true, minWidth: 100,
            render: (h, params) => showTip(h, params.row.description)
          },
          {
            title: '操作', align: 'center', width: 150,
            render: (h, params) => {
              const {id, type} = params.row;
              const view = h('Button', {
                props: {
                  type: 'ghost',
                  size: 'small'
                },
                style: {
                  "margin-left": '5px'
                },
                on: {
                  click: () => {
                    // this.$refs.DataVue.showModal(id, type);
                  }
                }
              }, '查看数据');
              const edit = h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  "margin-left": '5px'
                },
                on: {
                  click: () => {
                    this.$refs.AddVue.showModal(params.row);
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
                      content: '确认删除该车辆？',
                      onOk: () => {
                        $get(url.deleteVehicle, {id}).then(res => {
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
              const op = [];
              // op.push(view);
              if (this.roleId == 'ADMIN' || this.roleId == 'JGS') {
                op.push(edit);
                op.push(del);
              }
              return h('div', op);
            }
          }
        ];
        if (this.roleId == 'USER') {
          columns.splice(5, 1)
          columns.splice(6, 1)
        }
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
