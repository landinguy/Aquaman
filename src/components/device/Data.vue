<template>
  <div ref="AddVue">
    <Modal v-model="addModal" width="640">
      <p slot="header" style="text-align:center">
        <span>设备数据</span>
      </p>
      <div>
        <Table stripe border size="small" :columns="columns" :data="tableData"></Table>
        <Page :page-size="5" :total="total" show-total show-elevator @on-change="changePage"
              style="margin-top: 16px"></Page>
      </div>
      <div slot="footer" style="text-align: center">
        <Button type="ghost" shape="circle" class="radio_len" @click="cancel">关闭</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import {showTip, timestampToTime} from '@/libs/util'
  import url from '@/api/url'
  import {post, get, put} from "@/api/ax"

  export default {
    name: 'Add',
    data() {
      return {
        addModal: false,
        tableData: [],
        total: 0,
        id: '',
        type: null,
        params: {pageNo: 1, pageSize: 5},
      }
    },
    methods: {
      changePage(n) {
        this.params.pageNo = n;
        this.getData();
      },
      getData() {
        let params = this.params;
        params.id = this.id;
        post(url.getRecord, params).then(res => {
          const {total, list} = res.data;
          this.tableData = list;
          this.total = total;
        }).catch(err => console.log(err))
      },
      showModal(id, type) {
        this.id = id;
        this.type = type;
        this.addModal = true;
      },
      cancel() {
        this.addModal = false;
      },
    },
    computed: {
      columns() {
        let title = this.type == 1 ? '温度' : '湿度';
        const columns = [
          {
            title: '序号', type: 'index', width: 80, align: 'center'
          },
          {
            title: title, key: 'content', align: 'center', ellipsis: true, minWidth: 100,
            render: (h, params) => showTip(h, params.row.content)
          },
          {
            title: '采集时间', key: 'time', align: 'center', ellipsis: true, minWidth: 100,
            render: (h, params) => showTip(h, timestampToTime(parseInt(params.row.time)))
          }
        ];
        return columns;
      }
    },
    watch: {
      addModal(curVal, oldVal) {
        if (curVal) {
          this.getData();
        } else {
          this.id = ''
          this.params.pageNo = 1
        }
      }
    }
  }
</script>
<style lang="less">
  .radio_len {
    width: 80px;
    text-align: center;
  }
</style>
