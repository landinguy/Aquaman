import {showTip, timestampToTime} from '@/libs/util'

export const goodsColumn = () => {
  const columns = [
    {
      title: '商品名称', key: 'goodsName', align: 'center', ellipsis: true, minWidth: 80,
      render: (h, params) => showTip(h, params.row.goodsName)
    },
    {
      title: '商品类别', key: 'goodsType', align: 'center', ellipsis: true, minWidth: 80,
      render: (h, params) => showTip(h, params.row.goodsType)
    },
    {
      title: '商品价格（元）', key: 'price', align: 'center', ellipsis: true, minWidth: 80,
      render: (h, params) => showTip(h, params.row.price)
    },
    {
      title: '创建时间', key: 'date', align: 'center', ellipsis: true, minWidth: 80,
      render: (h, params) => showTip(h, timestampToTime(params.row.date))
    },
    // {
    //   title: '操作', align: 'center', width: 180,
    //   render: (h, params) => {
    //     const {id, url} = params.row;
    //     const download = h('Button', {
    //       props: {
    //         type: 'primary',
    //         size: 'small'
    //       },
    //       on: {
    //         click: () => this.download(id)
    //       }
    //     }, '下载');
    //     const share = h('Button', {
    //       props: {
    //         type: 'primary',
    //         size: 'small'
    //       },
    //       style: {
    //         "margin-left": '5px'
    //       },
    //       on: {
    //         click: () => this.$Message.info({
    //           content: `文件下载链接：${url}`,
    //           duration: 10,
    //           closable: true
    //         })
    //       }
    //     }, '分享');
    //     const del = h('Button', {
    //       props: {
    //         type: 'error',
    //         size: 'small'
    //       },
    //       style: {
    //         "margin-left": '5px'
    //       },
    //       on: {
    //         click: () => {
    //           this.$Modal.confirm({
    //             title: '删除',
    //             content: '确认删除该文件？',
    //             onOk: () => this.deleteFile(id)
    //           });
    //         }
    //       }
    //     }, '删除');
    //     const op = [];
    //     // if (this.role === 'ADMIN' || this.role === 'TEACHER' || this.role === 'COMPANY') {
    //     op.push(download);
    //     op.push(share);
    //     op.push(del);
    //     // }
    //     return h('div', op);
    //   }
    // }
  ];
  return columns
}
