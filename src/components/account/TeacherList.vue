<template>
  <div class="bg">
    <div class="search-div">
      <div class="search-div-item">
        <label>姓名</label>
        <Input v-model="params.nickname" placeholder="请输入姓名" class="width"/>
      </div>
      <div class="search-div-item">
        <label>用户名</label>
        <Input v-model="params.username" placeholder="请输入用户名" class="width"/>
      </div>
      <!--<div class="search-div-item">-->
      <!--<label>学段</label>-->
      <!--<Select v-model="params.stageId" @on-change="getGrades" class="width">-->
      <!--<Option value="1">小学</Option>-->
      <!--<Option value="2">初中</Option>-->
      <!--<Option value="3">高中</Option>-->
      <!--</Select>-->
      <!--</div>-->
      <!--<div class="search-div-item">-->
      <!--<label>年级</label>-->
      <!--<Select v-model="params.gradeId" @on-change="getClazzData" class="width">-->
      <!--<Option v-for="item in grades" :value="item.value" :key="item.value">{{ item.label }}</Option>-->
      <!--</Select>-->
      <!--</div>-->
      <!--<div class="search-div-item">-->
      <!--<label>班级</label>-->
      <!--<Select v-model="params.clazzId" class="width">-->
      <!--<Option v-for="item in clazzData" :value="item.value" :key="item.value">{{ item.label }}</Option>-->
      <!--</Select>-->
      <!--</div>-->
      <div class="search-div-item">
        <Button type="primary" @click="search">查询</Button>
      </div>
    </div>

    <div>
      <br>
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
  import {post, $del, get, $get} from "@/api/ax"
  import Add from './Add'
  import ExpandRow from './ExpandRow'

  export default {
    name: 'TeacherList',
    data() {
      return {
        content: 1,
        params: {username: '', nickname: '', stageId: '', gradeId: '', clazzId: '', pageNum: 1, pageSize: 10},
        tableData: [
          {
            username: 'test',
            nickname: 'test',
            role: '年级主任、班主任、任课教师',
            schoolName: '衡水中学',
            grade: '----',
            clazz: '高一1班',
            subject: '高一1班数学'
          }
        ], grades: [], clazzData: [],
        total: 0
      }
    },
    components: {Add, ExpandRow},
    methods: {
      changePage(n) {
        this.params.pageNum = n;
        this.getData();
      },
      search() {
        this.params.pageNum = 1;
        this.getData();
      },
      getData() {
        get(url.getTeachers, {}).then(res => {
          console.log(res)
          // const {total, list} = res.data;
          // this.tableData = list;
          // this.total = total;
        }).catch(err => console.log(err))
      },
      showModal() {
        this.$refs.AddVue.addModal = true;
      },
    },
    mounted() {
      // this.search();
    },
    computed: {
      ...mapGetters(['accountId', 'roleId']),
      columns() {
        const columns = [
          // {
          //   type: 'expand',
          //   width: 50,
          //   render: (h, params) => {
          //     return h(ExpandRow, {
          //       props: {
          //         row: params.row
          //       }
          //     })
          //   }
          // },
          {
            type: 'selection', minWidth: 60, align: 'center'
          },
          {
            title: '序号', type: 'index', minWidth: 80, align: 'center'
          },
          {
            title: '姓名', key: 'nickname', align: 'center', ellipsis: true, minWidth: 100,
            render: (h, params) => showTip(h, params.row.nickname)
          },
          {
            title: '用户名', key: 'username', align: 'center', ellipsis: true, minWidth: 100,
            render: (h, params) => showTip(h, params.row.username)
          },
          {
            title: '角色', key: 'role', align: 'center', ellipsis: true, minWidth: 150,
            render: (h, params) => {
              const {role, schoolName, grade, clazz, subject} = params.row;
              let arr = [];
              role.split('、').forEach(r => {
                let title = r == '校长' ? '学校' : r == '年级主任' ? '年级' : r == '班主任' ? '班级' : '任教信息';
                let type = r == '校长' ? 'error' : r == '年级主任' ? 'primary' : r == '班主任' ? 'info' : 'ghost';
                let content = r == '校长' ? schoolName : r == '年级主任' ? grade : r == '班主任' ? clazz : subject;
                const icon = h('Poptip', {
                    props: {trigger: 'hover', title: title, content: content},
                  },
                  [h('Button', {
                    props: {type: type, size: 'small'},
                    style: {marginRight: '5px'}
                  }, r)]);
                arr.push(icon);
              });
              return h('div', arr)
            }
          },
          {
            title: '操作', align: 'center', width: 200,
            render: (h, params) => {
              // const id = params.row.id;
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
                  }
                }
              }, '修改');
              const update = h('Button', {
                props: {
                  type: 'info',
                  size: 'small'
                },
                style: {
                  "margin-left": '5px'
                },
                on: {
                  click: () => {
                  }
                }
              }, '升级');
              // const del = h('Button', {
              //   props: {
              //     type: 'error',
              //     size: 'small'
              //   },
              //   style: {
              //     "margin-left": '5px'
              //   },
              //   on: {
              //     click: function () {
              //       $vue.$Modal.confirm({
              //         title: '删除',
              //         content: '确认删除该模板？',
              //         onOk() {
              //           $del(url.delTmpl + id, {accountId: this.accountId}).then(res => {
              //             if (res.code == 0) {
              //               $vue.$Message.success({
              //                 content: '已删除',
              //                 duration: 1,
              //                 onClose() {
              //                   $vue.search();
              //                 }
              //               });
              //             } else {
              //               $vue.$Message.error('删除失败');
              //             }
              //           });
              //         }
              //       });
              //     }
              //   }
              // }, '删除');
              const op = [];
              op.push(edit);
              // op.push(update);
              return h('div', op);
            }
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
