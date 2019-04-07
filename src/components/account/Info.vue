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
      <Table stripe border :columns="columns" :data="tableData"></Table>
      <Page :total="total" show-total show-elevator @on-change="changePage" style="margin-top: 16px"></Page>
    </div>
    <Add ref="AddVue"></Add>
  </div>
</template>
<script>
  import {mapMutations, mapGetters} from 'vuex'
  import {showTip, timestampToTime} from '@/libs/util'
  import url from '@/api/url'
  import {post, $del, get, $get, patch} from "@/api/ax"
  import Add from './Add'

  export default {
    name: 'Info',
    data() {
      return {
        content: 1,
        params: {username: '', nickname: '', pageNo: 1, pageSize: 10},
        tableData: [],
        total: 0
      }
    },
    components: {Add},
    methods: {
      clear() {
        this.params = {username: '', nickname: '', pageNo: 1, pageSize: 10}
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
        post(url.getAccount, this.params).then(res => {
          const {total, list} = res.data;
          this.tableData = list;
          this.total = total;
        }).catch(err => console.log(err))
      },
      showModal() {
        this.$refs.AddVue.showModal(null);
      }
    },
    mounted() {
      this.search()
    },
    computed: {
      ...mapGetters(['accountId', 'roleId']),
      columns() {
        const columns = [
          {
            title: '序号', type: 'index', width: 80, align: 'center'
          },
          {
            title: '姓名', key: 'nickname', align: 'center', ellipsis: true, minWidth: 80,
            render: (h, params) => showTip(h, params.row.nickname)
          },
          {
            title: '账号', key: 'username', align: 'center', ellipsis: true, minWidth: 80,
            render: (h, params) => showTip(h, params.row.username)
          },
          {
            title: '角色', key: 'role', align: 'center', ellipsis: true, minWidth: 80,
            render: (h, params) => {
              const {role} = params.row;
              return showTip(h, role == 'ADMIN' ? '管理员' : role == 'JGS' ? '交管所人员' : role == 'POLICEMAN' ? '交警' : '车主')
            }
          },
          {
            title: '手机号', key: 'phoneNumber', align: 'center', ellipsis: true, minWidth: 80,
            render: (h, params) => showTip(h, params.row.phoneNumber)
          },
          {
            title: '邮箱', key: 'email', align: 'center', ellipsis: true, minWidth: 80,
            render: (h, params) => showTip(h, params.row.email)
          },
          {
            title: '操作', align: 'center', width: 150,
            render: (h, params) => {
              const id = params.row.id;
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
                      content: '确认删除该用户？',
                      onOk: () => {
                        $get(url.deleteAccount, {id}).then(res => {
                          if (res.code == 0) {
                            this.$Message.success({
                              content: '已删除',
                              duration: 1,
                              onClose: () => {
                                this.search();
                              }
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
              op.push(edit);
              op.push(del);
              return h('div', op);
            }
          }
        ];
        // if (this.roleId != 'ADMIN') {
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
