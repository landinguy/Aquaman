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
      <Button v-if="roleId=='ADMIN'" type="primary" @click="showModal">
        <Icon type="plus"></Icon>
        添加设备
      </Button>
      <Button type="primary" @click="showAddRecordModal">
        <Icon type="plus"></Icon>
        添加模拟数据
      </Button>

    </div>
    <div style="margin-top: 16px">
      <Table stripe border :columns="columns" :data="tableData"></Table>
      <Page :total="total" show-total show-elevator @on-change="changePage" style="margin-top: 16px"></Page>
    </div>
    <Add ref="AddVue"></Add>
    <Data ref="DataVue"></Data>
    <AddRecord ref="AddRecordVue"></AddRecord>
  </div>
</template>
<script>
  import {mapMutations, mapGetters} from 'vuex'
  import {showTip, timestampToTime} from '@/libs/util'
  import url from '@/api/url'
  import {post, $del, get, $get, patch} from "@/api/ax"
  import Add from './Add'
  import Data from './Data'
  import AddRecord from './AddRecord'

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
    components: {Add, Data, AddRecord},
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
        if (this.roleId !== 'ADMIN') params.uid = this.accountId;

        post(url.getDevice, this.params).then(res => {
          const {total, list} = res.data;
          this.tableData = list;
          this.total = total;
        }).catch(err => console.log(err))
      },
      showModal() {
        this.$refs.AddVue.showModal(null);
      },
      showAddRecordModal() {
        this.$refs.AddRecordVue.showModal();
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
            title: '设备名', key: 'name', align: 'center', ellipsis: true, minWidth: 100,
            render: (h, params) => showTip(h, params.row.name)
          },
          {
            title: '所属用户', key: 'username', align: 'center', ellipsis: true, minWidth: 100,
            render: (h, params) => showTip(h, params.row.username)
          },
          {
            title: '设备描述', key: 'description', align: 'center', ellipsis: true, minWidth: 100,
            render: (h, params) => showTip(h, params.row.description)
          },
          {
            title: '操作', align: 'center', width: 200,
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
                    this.$refs.DataVue.showModal(id, type);
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
                      content: '确认删除该设备？',
                      onOk: () => {
                        $get(url.deleteDevice, {id}).then(res => {
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
              op.push(view);
              if (this.roleId == 'ADMIN') {
                op.push(edit);
                op.push(del);
              }
              return h('div', op);
            }
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
