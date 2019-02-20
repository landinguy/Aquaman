<template>
  <div class="bg">
    <!--<div class="sub">-->
    <!--<div class="sel">-->
    <!--<label>签名内容</label>-->
    <!--<Input v-model="params.find" placeholder="快速查找" class="width"/>-->
    <!--</div>-->
    <!--<div class="sel">-->
    <!--<label>状态</label>-->
    <!--<Select v-model="params.status" clearable class="width">-->
    <!--<Option value="AUDITING">审核中</Option>-->
    <!--<Option value="AUDIT_PASSED">审核通过</Option>-->
    <!--<Option value="AUDIT_FAILED">审核不通过</Option>-->
    <!--</Select>-->
    <!--</div>-->
    <!--<div class="sel">-->
    <!--<Button type="primary" @click="search">查询</Button>-->
    <!--</div>-->
    <!--<div style="clear: left"></div>-->
    <!--</div>-->

    <div>
      <Button type="primary" @click="toAddPage">
        <Icon type="plus"></Icon>
        添加
      </Button>
    </div>
    <div style="margin-top: 8px">
      <Table stripe border :columns="columns" :data="tableData"></Table>
      <Page :total="total" show-total show-elevator @on-change="changePage" style="margin-top: 16px"></Page>
    </div>
  </div>
</template>
<script>
  import {showTip, timestampToTime} from '@/libs/util'
  import {mapGetters} from 'vuex'
  import url from '@/api/url'
  import {post, $del} from "@/api/ax"
  import Add from './Add.vue'

  export default {
    name: 'SchoolList',
    data() {
      return {
        accountData: [],
        params: {
          pageNo: 1,
          pageSize: 10,
          find: '',
          status: ''
        },
        uploadUrl: '',
        columns: [
          {
            title: '创建时间',
            key: 'createTs',
            align: 'center',
            ellipsis: true,
            minWidth: 150,
            render: (h, params) => {
              return showTip(h, timestampToTime(params.row.createTs));
            }
          }, {
            title: '签名内容',
            key: 'content',
            align: 'center',
            ellipsis: true,
            minWidth: 150,
            render: (h, params) => {
              return showTip(h, params.row.content);
            }
          }, {
            title: '用户名称',
            key: 'cp',
            align: 'center',
            ellipsis: true,
            minWidth: 150,
            render: (h, params) => {
              return showTip(h, params.row.cp);
            }
          },
          {
            title: '签名状态',
            key: 'status',
            align: 'center',
            minWidth: 150,
            render: (h, params) => {
              const row = params.row;
              const color = row.status == 'AUDIT_PASSED' ? 'green' : row.status == 'AUDITING' ? 'blue' : row.status == 'AUDIT_FAILED' ? 'red' : 'gray';
              const text = row.status == 'AUDIT_PASSED' ? '审核通过' : row.status == 'AUDITING' ? '审核中' : row.status == 'AUDIT_FAILED' ? '审核不通过' : '未知';
              return h('span', {
                style: {
                  color: color
                }
              }, text)
            }
          },
          {
            title: '操作账户',
            key: 'cp',
            align: 'center',
            ellipsis: true,
            minWidth: 150,
            render: (h, params) => {
              return showTip(h, params.row.cp);
            }
          }, {
            title: '审核时间',
            key: 'auditTs',
            align: 'center',
            ellipsis: true,
            minWidth: 150,
            render: (h, params) => {
              let txt = params.row.auditTs == 0 ? '' : timestampToTime(params.row.auditTs);
              return showTip(h, txt);
            }
          }, {
            title: '操作',
            key: 'op',
            align: 'left',
            width: 150,
            render: (h, params) => {
              const $vue = this;
              const id = params.row.id;
              const op = [];
              const modify = h('Button', {
                props: {
                  type: 'ghost',
                  size: 'small'
                },
                style: {
                  "margin-left": '5px'
                },
                on: {
                  click: function () {
                    $vue.$refs.AddVue.setData("修改", params.row);
                  }
                }
              }, '修改');
              const del = h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: function () {
                    $vue.$Modal.confirm({
                      title: '删除',
                      content: '确认删除该签名？',
                      onOk() {
                        $del(url.delSign + id, {}).then(res => {
                          if (res.code == 0) {
                            $vue.$Message.success({
                              content: '已删除',
                              duration: 1,
                              onClose() {
                                $vue.search();
                              }
                            });
                          } else {
                            $vue.$Message.error('删除失败');
                          }
                        });
                      }
                    });
                  }
                }
              }, '删除');
              if (params.row.status != 'AUDITING') {
                op.push(del)
              }
              if (params.row.status == 'AUDIT_FAILED') {
                op.push(modify)
              }
              return h('div', op);
            }
          }
        ],
        tableData: [],
        addModal: false,
        total: 0
      }
    },
    components: {
      Add
    },
    methods: {
      toAddPage() {
        this.$router.push({name: 'addSchool'})
      },
      changePage(n) {
        this.params.pageNo = n;
        this.getSignList();
      },
      getSignList() {
        let params = this.params;
        console.log("params:" + JSON.stringify(params));
        post(url.getSigns, params).then(res => {
          if (res) {
            this.tableData = res.data
          }
        })
      },
      getTotal() {
        post(url.getSignsCount, {
          status: this.params.status,
          find: this.params.find,
        }).then(res => {
          if (res) {
            this.total = res.data;
          }
        })
      },
      search() {
        this.params.pageNo = 1;
        this.getTotal();
        this.getSignList();
      },
    },
    mounted() {
      // this.search();
    },
    computed: {}
  }
</script>
<style scoped>
  .bg {
    background-color: white;
    width: 100%;
    height: 100%;
    padding: 32px;
  }

  .sub {
    width: 100%;
    background-color: white;
  }

  .sel {
    margin-top: 4px;
    padding-bottom: 4px;
    float: left;
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
