<template>
  <div class="bg">
    <div class="search-div">
      <div class="search-div-item">
        <label>学段</label>
        <Select v-model="params.stageId" @on-change="getGrades" class="width">
          <Option value="1">小学</Option>
          <Option value="2">初中</Option>
          <Option value="3">高中</Option>
        </Select>
      </div>
      <div class="search-div-item">
        <label>年级</label>
        <Select v-model="params.gradeId" @on-change="getClazzData" class="width">
          <Option v-for="item in grades" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div class="search-div-item">
        <label>班级</label>
        <Select v-model="params.clazzId" class="width">
          <Option v-for="item in clazzData" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
    </div>
    <div class="search-div">
      <div class="search-div-item">
        <label>姓名</label>
        <Input v-model="params.nickname" placeholder="请输入姓名" class="width"/>
      </div>
      <div class="search-div-item">
        <label>账号</label>
        <Input v-model="params.username" placeholder="请输入账号" class="width"/>
      </div>
      <div class="search-div-item">
        <Button type="primary" @click="search">查询</Button>
        <Button type="ghost" @click="clear" style="margin-left: 16px">清空</Button>
      </div>
    </div>

    <div v-if="roleId=='ADMIN'">
      <br>
      <Button type="primary" @click="showModal" class="btn-width">
        <Icon type="plus"></Icon>
        添加
      </Button>
      <Upload ref="upload"
              :action="uploadUrl"
              :format="['xlsx']"
              :show-upload-list="false"
              :before-upload="handleBeforeUpload"
              :on-success="handleSuccess"
              :with-credentials="true"
              :headers="headers"
              style="display: inline-block;margin-left: 8px">
        <Button type="primary" icon="ios-cloud-upload-outline" class="btn-width">导入</Button>
      </Upload>
    </div>
    <div style="margin-top: 16px">
      <Table stripe border :columns="columns" :data="tableData"></Table>
      <Page :total="total" show-total show-elevator @on-change="changePage" style="margin-top: 16px"></Page>
    </div>
    <AddTeacher ref="AddVue"></AddTeacher>
  </div>
</template>
<script>
  import {mapMutations, mapGetters} from 'vuex'
  import {showTip, timestampToTime} from '@/libs/util'
  import baseUrl from "@/libs/url"
  import url from '@/api/url'
  import {post, $del, get, $get, patch} from "@/api/ax"
  import AddTeacher from './AddTeacher'
  import ExpandRow from './ExpandRow'

  export default {
    name: 'TeacherList',
    data() {
      return {
        uploadUrl: baseUrl.base + url.importTeacher,
        content: 1,
        params: {username: '', nickname: '', stageId: '', gradeId: '', clazzId: '', pageNum: 1, pageSize: 10},
        tableData: [],
        grades: [], clazzData: [],
        total: 0
      }
    },
    components: {AddTeacher, ExpandRow},
    methods: {
      handleBeforeUpload(file) {
        let index = file.name.lastIndexOf(".");
        let type = file.name.substring(index + 1);

        let arr = ['xlsx'];
        if (arr.indexOf(type.toLowerCase()) == -1) {
          this.$Message.error('请上传xlsx文件');
          return false;
        }
        if (this.$refs.upload.fileList.length > 0) {
          this.$refs.upload.clearFiles();
        }
      },
      handleSuccess(res, file) {
        const {ret_code, error_msg} = res
        if (ret_code == 0) {
          this.$Message.success({
            content: '上传成功',
            duration: 1,
            onClose: () => this.search()
          })
        } else {
          this.$Message.error(error_msg ? error_msg : '上传失败')
        }
      },
      clear() {
        this.params = {username: '', nickname: '', stageId: '', gradeId: '', clazzId: '', pageNum: 1, pageSize: 10}
      },
      getClazzData() {
        this.clazzData = [];
        this.params.clazzId = '';
        let gradeId = this.params.gradeId;
        if (gradeId) {
          get(url.getClazzByGradeId + gradeId, {}).then(res => {
            const {clazzList} = res.data;
            clazzList.forEach(item => this.clazzData.push({label: item.clazzName, value: item.clazzId}))
          }).catch(err => console.log(err))
        }
      },
      getGrades() {
        this.grades = [];
        const {stageId} = this.params;
        if (stageId) {
          get(url.getGradesByStageId + stageId, {}).then(res =>
            res.data.forEach(item => this.grades.push({label: item.gradeName, value: item.gradeId}))
          ).catch(err => console.log(err));
        }
      },
      changePage(n) {
        this.params.pageNum = n;
        this.getData();
      },
      search() {
        this.params.pageNum = 1;
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
        this.$refs.AddVue.showModal(null);
      }
    },
    mounted() {
      this.search();
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
            type: 'selection', width: 60, align: 'center'
          },
          {
            title: '序号', type: 'index', width: 80, align: 'center'
          },
          {
            title: '姓名', key: 'nickname', align: 'center', ellipsis: true, minWidth: 100,
            render: (h, params) => showTip(h, params.row.nickname)
          },
          {
            title: '账号', key: 'username', align: 'center', ellipsis: true, minWidth: 100,
            render: (h, params) => showTip(h, params.row.username)
          },
          {
            title: '角色', align: 'left', ellipsis: true, minWidth: 100,
            render: (h, params) => {
              let arr = [];
              const {roleInfoList} = params.row;
              roleInfoList.forEach(item => {
                const {type, tip} = item;
                let title = type == 'PRESIDENT' ? '学校' : type == 'GRADE_LEADER' ? '年级' : type == 'CLASS_TEACHER' ? '班级' : '任教信息';
                let t = type == 'PRESIDENT' ? 'error' : type == 'GRADE_LEADER' ? 'primary' : type == 'CLASS_TEACHER' ? 'info' : 'ghost';
                let roleName = type == 'PRESIDENT' ? '校领导' : type == 'GRADE_LEADER' ? '年级主任' : type == 'CLASS_TEACHER' ? '班主任' : '任课教师';
                const icon = h('Poptip', {
                    props: {trigger: 'hover', title: title, content: tip},
                  },
                  [h('Button', {
                    props: {type: t, size: 'small'},
                    style: {marginRight: '5px'}
                  }, roleName)]);
                arr.push(icon);
              })
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
                    this.$refs.AddVue.showModal(params.row);
                  }
                }
              }, '修改');
              const reset = h('Button', {
                props: {
                  type: 'ghost',
                  size: 'small'
                },
                style: {
                  "margin-left": '5px'
                },
                on: {
                  click: () => {
                    patch(url.resetPassword, {username: params.row.username}).then(res => {
                      if (res.ret_code == 0) {
                        this.$Message.success('重置成功')
                      } else {
                        this.$Message.error('重置失败')
                      }
                    }).catch(err => console.log(err))
                  }
                }
              }, '重置密码');
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
              op.push(reset);
              return h('div', op);
            }
          }
        ];
        if (this.roleId != 'ADMIN') {
          columns.splice(5, 1)
        }
        return columns;
      },
      headers() {
        return {'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken')}
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

  .btn-width {
    width: 80px;
  }
</style>
