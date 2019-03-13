<template>
  <div>
    <Table :columns="columns" :data="data"></Table>
  </div>
</template>
<script>
  import url from '@/api/url';
  import {post, get} from "@/api/ax";
  import {showTip, timestampToTime} from '@/libs/util'

  export default {
    name: 'Item',
    props: {
      title: {type: String, default: 'title'},
      data: {type: Array}
    },
    data() {
      return {
        columns: [{
          title: this.title, align: 'center',
          children: [
            {
              title: '教师姓名', key: 'teacherName', align: 'center', ellipsis: true, minWidth: 150,
              render: (h, params) => showTip(h, params.row.teacherName)
            },
            {
              title: '班级科目', key: 'category', align: 'center', ellipsis: true, minWidth: 150,
              render: (h, params) => showTip(h, params.row.category)
            },
            {
              title: '次数', key: 'cnt', align: 'center', ellipsis: true, minWidth: 150,
              render: (h, params) => showTip(h, params.row.cnt)
            }
          ]
        }]
      }
    },
    methods: {},
    computed: {},
    mounted() {
    }
  }
</script>
