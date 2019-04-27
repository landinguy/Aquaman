<template>
  <div class="bg">
    <!--<div class="search-div">-->
    <!--<div class="search-div-item">-->
    <!--<label>学段</label>-->
    <!--<Select v-model="params.stageId" class="width">-->
    <!--<Option value="1">小学</Option>-->
    <!--<Option value="2">初中</Option>-->
    <!--<Option value="3">高中</Option>-->
    <!--</Select>-->
    <!--</div>-->
    <!--<div class="search-div-item">-->
    <!--<Button type="primary" @click="search">查询</Button>-->
    <!--</div>-->
    <!--</div>-->
    <div>
      <Button type="primary" @click="showModal">
        <Icon type="plus"></Icon>
        添加
      </Button>
    </div>
    <div style="margin-top: 8px">
      <Table stripe border :columns="columns" :data="tableData"></Table>
      <Page :total="total" show-total show-elevator @on-change="changePage" style="margin-top: 16px"></Page>
    </div>
    <AddSchool ref="AddVue"></AddSchool>
  </div>
</template>
<script>
  import {mapMutations, mapGetters} from 'vuex'
  import {showTip, timestampToTime} from '@/libs/util'
  import url from '@/api/url'
  import {post, get, $del, $get, put} from "@/api/ax"
  import AddSchool from './AddSchool'

  export default {
    name: 'List',
    data() {
      return {
        params: {pageNum: 1, pageSize: 10},
        columns: [
          {
            title: '序号', type: 'index', width: 80, align: 'center'
          },
          {
            title: '学校名称', key: 'name', align: 'center', ellipsis: true, minWidth: 100,
            render: (h, params) => showTip(h, params.row.name)
          },
          {
            title: '学校编号', key: 'schoolCode', align: 'center', ellipsis: true, minWidth: 100,
            render: (h, params) => showTip(h, params.row.schoolCode)
          },
          {
            title: '操作', align: 'center', width: 200,
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
                      content: '确认删除该学校？',
                      onOk: () => {
                        $del(url.addSchool + `?schoolId=${id}`, {}).then(res => {
                          if (res.ret_code == 0) {
                            this.$Message.success({
                              content: '已删除',
                              duration: 1,
                              onClose: () => this.search()
                            })
                          } else {
                            this.$Message.error('删除失败')
                          }
                        })
                      }
                    })
                  }
                }
              }, '删除')
              const op = []
              op.push(edit)
              op.push(del)
              return h('div', op)
            }
          }
        ],
        tableData: [],
        total: 0
      }
    },
    components: {AddSchool},
    methods: {
      changePage(n) {
        this.params.pageNum = n
        this.getData()
      },
      showModal() {
        this.$refs.AddVue.showModal(null)
      },
      getData() {
        $get(url.getSchool, this.params).then(res => {
          const {total, list} = res.data
          this.total = total
          this.tableData = list
        }).catch(err => console.log(err))
      },
      search() {
        this.params.pageNum = 1
        this.getData()
      },
    },
    mounted() {
      this.search();
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
