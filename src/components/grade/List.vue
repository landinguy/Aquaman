<template>
  <div class="bg">
    <div class="search-div">
      <div class="search-div-item">
        <label>学段</label>
        <Select v-model="params.stageId" class="width">
          <Option value="1">小学</Option>
          <Option value="2">初中</Option>
          <Option value="3">高中</Option>
        </Select>
      </div>
      <div class="search-div-item">
        <Button type="primary" @click="search">查询</Button>
      </div>
    </div>

    <div v-if="roleId=='ADMIN'">
      <Button type="primary" @click="showModal">
        <Icon type="md-add"></Icon>
        添加
      </Button>
    </div>
    <div style="margin-top: 8px">
      <Table stripe border :columns="columns" :data="tableData"></Table>
    </div>
    <Add ref="AddVue"></Add>
  </div>
</template>
<script>
  import {mapMutations, mapGetters} from 'vuex'
  import {showTip, timestampToTime} from '@/libs/util'
  import url from '@/api/url'
  import {post, get, $del, $get, put} from "@/api/ax"
  import Add from './Add.vue'

  export default {
    name: 'List',
    data() {
      return {
        params: {stageId: '1'},
        columns: [
          {
            title: '序号', type: 'index', width: 80, align: 'center'
          },
          {
            title: '学段', key: 'stageName', align: 'center', ellipsis: true, minWidth: 100,
            render: (h, params) => showTip(h, params.row.stageName)
          },
          {
            title: '年级名称', key: 'gradeName', align: 'center', ellipsis: true, minWidth: 100,
            render: (h, params) => showTip(h, params.row.gradeName)
          },
          {
            title: '操作', align: 'center', width: 160,
            render: (h, params) => {
              const {id} = params.row
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
              }, '修改')
              const del = h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  "margin-left": '5px'
                },
                on: {
                  click: () =>
                    this.$Modal.confirm({
                      title: '删除',
                      content: '确认删除该年级？',
                      onOk: () =>
                        $del(url.delTmpl + id, {}).then(res => {
                          if (res.ret_code == 0) {
                            this.$Message.success({
                              content: '已删除',
                              duration: 1,
                              onClose: () => this.search()
                            })
                          } else {
                            this.$Message.error('删除失败')
                          }
                        }).catch(err => console.log(err))
                    })
                }
              }, '删除')
              const op = []
              op.push(edit)
              op.push(del)
              return h('div', op)
            }
          }
        ],
        tableData: []
      }
    },
    components: {Add},
    methods: {
      showModal() {
        this.$refs.AddVue.showModal(null);
      },
      getData() {
        $get(url.getGrade, this.params).then(res => this.tableData = res.data).catch(err => console.log(err))
      },
      search() {
        this.getData();
      },
    },
    mounted() {
      this.search();
      if (this.roleId != 'ADMIN') {
        this.columns.splice(3, 1)
      }
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
