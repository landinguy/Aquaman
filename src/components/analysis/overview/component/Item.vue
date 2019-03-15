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
              title: '排名', align: 'center', minWidth: 60,
              render: (h, params) => {
                let index = params.row._index + 1;
                let color = index == 1 ? '#F7C726' : index == 2 ? '#68EE41' : '#3BB8FF';
                return h('div', {style: {textAlign: 'center'}}, [
                  h('span', {
                    style: {
                      backgroundColor: color,
                      display: 'inline-block',
                      width: '20px',
                      height: '20px',
                      lineHeight: '20px',
                      borderRadius: '10px',
                    }
                  }, index)
                ])
              }
            },
            {
              title: '教师姓名', key: 'teacherName', align: 'center', ellipsis: true, minWidth: 100,
              render: (h, params) => showTip(h, params.row.teacherName)
            },
            {
              title: '班级科目', key: 'category', align: 'center', ellipsis: true, minWidth: 140,
              render: (h, params) => showTip(h, params.row.category)
            },
            {
              title: '次数', key: 'cnt', align: 'center', ellipsis: true, minWidth: 60,
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
