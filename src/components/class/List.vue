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
        <Select v-model="params.gradeId" class="width">
          <Option v-for="item in grades" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div class="search-div-item width">
        <Button type="primary" @click="search">查询</Button>
        <Button type="default" @click="clear" style="margin-left: 16px">清空</Button>
      </div>
    </div>

    <div v-if="roleId=='ADMIN'">
      <Button type="primary" @click="showModal" class="btn-width">
        <Icon type="md-add"></Icon>
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
    <div style="margin-top: 8px">
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
  import baseUrl from "@/libs/url"
  import {post, get, $get, $del} from "@/api/ax"
  import Add from './Add.vue'

  export default {
    name: 'List',
    data() {
      return {
        uploadUrl: baseUrl.base + url.importClazz,
        params: {pageNum: 1, pageSize: 10, stageId: '', gradeId: ''},
        columns: [
          {
            title: '序号', type: 'index', width: 80, align: 'center'
          },
          {
            title: '学段', key: 'stageName', align: 'center', ellipsis: true, minWidth: 100,
            render: (h, params) => showTip(h, params.row.stageName)
          },
          {
            title: '年级', key: 'gradeName', align: 'center', ellipsis: true, minWidth: 100,
            render: (h, params) => showTip(h, params.row.gradeName)
          },
          {
            title: '班级名称', key: 'clazzName', align: 'center', ellipsis: true, minWidth: 100,
            render: (h, params) => showTip(h, params.row.clazzName)
          },
          {
            title: '操作', align: 'center', width: 160,
            render: (h, params) => {
              const id = params.row.clazzId
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
                      content: '确认删除该班级？',
                      onOk: () =>
                        $del(url.addClazz + `?clazzId=${id}`, {}).then(res => {
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
        tableData: [], grades: [], total: 0
      }
    },
    components: {Add},
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
        this.params = {pageNum: 1, pageSize: 10, stageId: '', gradeId: ''}
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
      showModal() {
        this.$refs.AddVue.showModal(null);
      },
      changePage(n) {
        this.params.pageNum = n;
        this.getData();
      },
      getData() {
        this.tableData = [];
        $get(url.getClazz, this.params).then(res => {
          const {total, list} = res.data;
          this.tableData = list;
          this.total = total;
        }).catch(err => console.log(err))
      },
      search() {
        this.params.pageNum = 1;
        this.getData();
      }
    },
    mounted() {
      this.search();
      if (this.roleId != 'ADMIN') {
        this.columns.splice(4, 1)
      }
    },
    computed: {
      ...mapGetters(['accountId', 'roleId']),
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
