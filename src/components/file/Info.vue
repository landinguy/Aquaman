<template>
  <div class="bg">
    <div>
      <Button type="primary" @click="showModal">上传文件</Button>
    </div>
    <div style="margin-top: 16px">
      <Table stripe border :columns="columns" :data="tableData"></Table>
      <Page :total="total" show-total show-elevator @on-change="changePage" style="margin-top: 16px"></Page>
    </div>
    <Add ref="AddVue"></Add>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'
  import {showTip} from '@/libs/util'
  import url from '@/api/url'
  import {$get, post} from "@/api/ax"
  import Add from './Add'
  import baseUrl from "@/libs/url"

  export default {
    name: 'Info',
    data() {
      return {
        params: {
          pageNo: 1, pageSize: 10
        },
        tableData: [],
        total: 0,
        questions: []
      }
    },
    components: {Add},
    methods: {
      clear() {
        this.params = {pageNo: 1, pageSize: 10}
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
        post(url.files, {...this.params, uid: this.accountId}).then(res => {
          const {total, list} = res.data;
          this.tableData = list;
          this.total = total;
        }).catch(err => console.log(err))
      },
      showModal() {
        this.$refs.AddVue.showModal(null);
      },
      deleteFile(id) {
        $get(url.deleteFile, {id}).then(res => {
          if (res.code === 0) {
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
      },
      download(id) {
        window.open(`${baseUrl.base}${url.download}?fid=${id}`)
      }
    },
    mounted() {
      this.search();
    },
    computed: {
      ...mapGetters(['accountId', 'role']),
      columns() {
        const columns = [
          {
            title: '文件名', key: 'name', align: 'center', ellipsis: true, minWidth: 80,
            render: (h, params) => showTip(h, params.row.name)
          },
          {
            title: '创建时间', key: 'create_ts', align: 'center', ellipsis: true, minWidth: 80,
            render: (h, params) => showTip(h, params.row.create_ts)
          },
          {
            title: '文件大小（字节）', key: 'size', align: 'center', ellipsis: true, minWidth: 80,
            render: (h, params) => showTip(h, params.row.size)
          },
          {
            title: '操作', align: 'center', width: 180,
            render: (h, params) => {
              const {id, url} = params.row;
              const download = h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => this.download(id)
                }
              }, '下载');
              const share = h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  "margin-left": '5px'
                },
                on: {
                  click: () => this.$Message.info({
                    content: `文件下载链接：${url}`,
                    duration: 10,
                    closable: true
                  })
                }
              }, '分享');
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
                      content: '确认删除该文件？',
                      onOk: () => this.deleteFile(id)
                    });
                  }
                }
              }, '删除');
              const op = [];
              // if (this.role === 'ADMIN' || this.role === 'TEACHER' || this.role === 'COMPANY') {
              op.push(download);
              op.push(share);
              op.push(del);
              // }
              return h('div', op);
            }
          }
        ];
        // if (this.role === 'STUDENT' || this.role === 'INTERVIEWER') {
        //   columns.splice(6, 1)
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
