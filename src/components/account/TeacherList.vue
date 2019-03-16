<template>
  <div class="bg">
    <div class="search-div">
      <div class="search-div-item">
        <label>用户名</label>
        <Input v-model="params.username" placeholder="请输入用户名" class="width"/>
      </div>
      <div class="search-div-item">
        <label>姓名</label>
        <Input v-model="params.nickname" placeholder="请输入姓名" class="width"/>
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

  export default {
    name: 'TeacherList',
    data() {
      return {
        content: 1,
        params: {username: '', nickname: '', stageId: '1', gradeId: '', clazzId: '', pageNum: 1, pageSize: 10},
        tableData: [], grades: [], clazzData: [],
        total: 0
      }
    },
    components: {Add},
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
        $get(url.getTeachers, this.params).then(res => {
          const {total, list} = res.data;
          this.tableData = list;
          this.total = total;
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
          {
            title: '用户名', key: 'username', align: 'center', ellipsis: true, minWidth: 150,
            render: (h, params) => showTip(h, params.row.username)
          },
          {
            title: '姓名', key: 'nickname', align: 'center', ellipsis: true, minWidth: 150,
            render: (h, params) => showTip(h, params.row.nickname)
          },
          {
            title: '角色', key: 'role', align: 'center', ellipsis: true, minWidth: 150,
            render: (h, params) => showTip(h, params.row.role)
          },
          {
            title: '学段', key: 'stage', align: 'center', ellipsis: true, minWidth: 150,
            render: (h, params) => showTip(h, params.row.stage)
          },
          {
            title: '年级', key: 'grade', align: 'center', ellipsis: true, minWidth: 150,
            render: (h, params) => showTip(h, params.row.grade)
          },
          {
            title: '班级', key: 'class', align: 'center', ellipsis: true, minWidth: 150,
            render: (h, params) => showTip(h, params.row.class)
          },
          // {
          //   title: '操作',
          //   align: 'center',
          //   width: 200,
          //   render: (h, params) => {
          //     const id = params.row.id;
          //     const $vue = this;
          //     const status = params.row.status;
          //     const dynamic = params.row.dynamic;
          //     const view = h('Button', {
          //       props: {
          //         type: 'primary',
          //         size: 'small'
          //       },
          //       on: {
          //         click: function () {
          //           $vue.setOperation('view');
          //           $vue.setId(id);
          //           $vue.content = 2;
          //         }
          //       },
          //     }, '查看');
          //     const copy = h('Button', {
          //       props: {
          //         type: 'info',
          //         size: 'small'
          //       },
          //       style: {
          //         "margin-left": '5px'
          //       },
          //       on: {
          //         click: function () {
          //           $vue.setOperation('copy');
          //           $vue.setId(id);
          //           $vue.content = 2;
          //         }
          //       }
          //     }, '复制');
          //     const edit = h('Button', {
          //       props: {
          //         type: 'info',
          //         size: 'small'
          //       },
          //       style: {
          //         "margin-left": '5px'
          //       },
          //       on: {
          //         click: function () {
          //           $vue.setOperation('modify');
          //           $vue.setId(id);
          //           $vue.content = 2;
          //         }
          //       }
          //     }, '修改');
          //     const del = h('Button', {
          //       props: {
          //         type: 'error',
          //         size: 'small'
          //       },
          //       style: {
          //         "margin-left": '5px'
          //       },
          //       on: {
          //         click: function () {
          //           $vue.$Modal.confirm({
          //             title: '删除',
          //             content: '确认删除该模板？',
          //             onOk() {
          //               $del(url.delTmpl + id, {accountId: this.accountId}).then(res => {
          //                 if (res.code == 0) {
          //                   $vue.$Message.success({
          //                     content: '已删除',
          //                     duration: 1,
          //                     onClose() {
          //                       $vue.search();
          //                     }
          //                   });
          //                 } else {
          //                   $vue.$Message.error('删除失败');
          //                 }
          //               });
          //             }
          //           });
          //         }
          //       }
          //     }, '删除');
          //     const op = [];
          //     op.push(view);
          //     if (this.roleId == 1) {
          //       op.push(del);
          //       if (status == 'AUDIT_PASS' || status == 'OBSOLETED' || status == 'AUDITING') op.push(copy);
          //       if (status == 'AUDITING' || status == 'AUDIT_FAILED') op.push(edit);
          //     }
          //     return h('div', op);
          //   }
          // }
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
