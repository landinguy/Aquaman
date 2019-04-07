<template>
  <div class="bg">
    <div>
      <Table stripe border size="small" :columns="columns" :data="tableData"></Table>
      <Page :total="total" show-total show-elevator @on-change="changePage" style="margin-top: 16px"></Page>
    </div>
  </div>
</template>
<script>
  import {mapMutations, mapGetters} from 'vuex'
  import {showTip, timestampToTime} from '@/libs/util'
  import url from '@/api/url'
  import {post, $del, get, $get, patch} from "@/api/ax"

  export default {
    name: 'Info',
    data() {
      return {
        params: {pageNo: 1, pageSize: 10},
        tableData: [],
        total: 0
      }
    },
    methods: {
      changePage(n) {
        this.params.pageNo = n;
        this.getData();
      },
      search() {
        this.params.pageNo = 1;
        this.getData();
      },
      getData() {
        post(url.getLog, this.params).then(res => {
          const {total, list} = res.data;
          this.tableData = list;
          this.total = total;
        }).catch(err => console.log(err))
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
            title: '操作内容', key: 'content', align: 'center', ellipsis: true, minWidth: 100,
            render: (h, params) => showTip(h, params.row.content)
          },
          {
            title: '操作人', key: 'username', align: 'center', ellipsis: true, minWidth: 100,
            render: (h, params) => showTip(h, params.row.username)
          },
          {
            title: '操作时间', key: 'time', align: 'center', ellipsis: true, minWidth: 100,
            render: (h, params) => showTip(h, timestampToTime(parseInt(params.row.time)))
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
</style>
