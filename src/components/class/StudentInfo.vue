<template>
  <div class="bg" ref="StudentInfoVue">
    <div slot="header" style="text-align:center">
      <h2>学生列表</h2>
    </div>
    <div>
      <div style="margin-top: 16px">
        <template v-for="item in students">
          <tag  closable @on-close="handleClose(item.id)">{{item.name}}</tag>
        </template>
      </div>
    </div>
    <div style="text-align: center;margin-top: 32px" v-if="roleId==='ADMIN' || roleId==='TEACHER'">
      <Button type="primary" shape="circle" class="radio_len" @click="addStudent">添加学生</Button>
    </div>
    <add-student ref="AddStudentVue"/>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'
  import url from '@/api/url'
  import {get} from "@/api/ax"
  import AddStudent from "./AddStudent";

  export default {
    name: 'StudentInfo',
    data() {
      return {
        students: [],
        classId: null
      }
    },
    components: {AddStudent},
    methods: {
      handleClose(id) {
        this.$Modal.confirm({
          title: '删除',
          content: '确认删除该学生？',
          onOk: () => {
            get(url.deleteStudent + id, {}).then(res => {
              if (res.code === 0) {
                this.$Message.success({
                  content: '已删除',
                  duration: 1,
                  onClose: () => this.getData(this.classId)
                });
              } else {
                this.$Message.error('删除失败');
              }
            });
          }
        });
      },
      addStudent() {
        this.$refs.AddStudentVue.showModal(this.classId);
      },
      getData(classId) {
        if (classId) {
          this.classId = classId;
          get(url.getClassStudent + classId, {}).then(res => {
            if (res.code === 0) {
              this.students = res.data;
            }
          }).catch(err => console.log(err))
        }
      }
    },
    computed: {
      ...mapGetters(['accountId', 'roleId'])
    }
  }
</script>
<style scoped lang="less">
  .bg {
    background-color: white;
    width: 100%;
    height: 100%;
    padding: 16px;
  }

  .radio_len {
    width: 80px;
    text-align: center;
  }
</style>
