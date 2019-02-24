<template>
  <div class="bg">
    <Form ref="form" :model="formData" :rules="formValidate" :label-width="100">
      <FormItem label="用户名" prop="username">
        <Input v-model.trim="formData.username" placeholder="请填写用户名"/>
      </FormItem>
      <FormItem label="密码" prop="password">
        <Input v-model.trim="formData.password" type="password" placeholder="请填写密码"/>
      </FormItem>
      <FormItem label="昵称" prop="nickname">
        <Input v-model.trim="formData.nickname" placeholder="请填写昵称"/>
      </FormItem>
      <FormItem label="角色" prop="role">
        <Select v-model="formData.role" multiple @on-change="changeRole">
          <Option value="PRESIDENT" :disabled="flag1">校长</Option>
          <Option value="GRADE_LEADER" :disabled="flag1">年级主任</Option>
          <Option value="CLASS_TEACHER" :disabled="flag1">班主任</Option>
          <Option value="TEACHER" :disabled="flag1">任课教师</Option>
          <Option value="STUDENT" :disabled="flag2">学生</Option>
        </Select>
      </FormItem>
      <template v-if="!isPresident">
        <FormItem label="学段" prop="stageId">
          <Select v-model="formData.stageId" @on-change="getGrades">
            <Option value="1">小学</Option>
            <Option value="2">初中</Option>
            <Option value="3">高中</Option>
          </Select>
        </FormItem>

        <FormItem label="年级" prop="gradeId">
          <Select v-model="formData.gradeId" placement="bottom" @on-change="getClazzData">
            <Option v-for="item in grades" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>

        <FormItem label="班级" prop="clazzName" v-if="!isGradeLeader">
          <Select v-model="formData.clazzName" multiple>
            <Option v-for="item in clazzData" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>

        <FormItem label="科目" prop="subject" v-if="isTeacher">
          <Select v-model="formData.subject" placement="bottom">
            <Option v-for="item in subjectData" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
      </template>
    </Form>
    <div class="btn_div">
      <template v-if="op!='view'">
        <Button type="primary" class="radio_len" @click="confirm">提交</Button>
        <Button type="ghost" class="radio_len" style="margin-left: 20px" @click="cancel">取消</Button>
      </template>
      <template v-if="op=='view'">
        <Button type="ghost" class="radio_len" style="margin-left: 20px" @click="back">返回</Button>
      </template>
    </div>
  </div>
</template>
<script>
  import url from '@/api/url'
  import {post, get} from "@/api/ax";

  export default {
    name: 'Add',
    data() {
      return {
        op: '',
        formData: {
          username: '',
          password: '',
          nickname: '',
          role: [],
          stageId: '',
          gradeId: '',
          clazzName: [],
          subject: ''
        },
        id: '',
        formValidate: {
          username: [{required: true, message: '请填写用户名', trigger: 'blur'}],
          password: [{required: true, message: '请填写密码', trigger: 'blur'}],
          nickname: [{required: true, message: '请填写昵称', trigger: 'blur'}],
          role: [{required: true, type: 'array', min: 1, message: '请选择至少一个角色', trigger: 'change'}],
          stageId: [{required: true, message: '请选择学段', trigger: 'change'}],
          gradeId: [{required: true, message: '请选择年级', trigger: 'change'}],
          clazzName: [{required: true, type: 'array', min: 1, message: '请选择班级', trigger: 'change'}]
        },
        flag1: false,
        flag2: false,
        isPresident: false,
        isGradeLeader: false,
        isTeacher: false,
        grades: [],
        clazzData: [],
        subjectData: []
      }
    },
    methods: {
      changeRole(val) {
        this.isPresident = this.isGradeLeader = this.isTeacher = false

        if (val.length > 0 && val.indexOf('STUDENT') != -1) {
          this.flag1 = true;
        } else if (val.length == 0) {
          this.flag2 = this.flag1 = false;
        } else {
          this.flag2 = true;
        }
        //只选了校长
        if (val.length == 1 && val.indexOf('PRESIDENT') != -1) {
          this.isPresident = true
        }
        //只选了年级主任 或 年级主任+校长
        if (val.indexOf('GRADE_LEADER') != -1 && (val.length == 1 || (val.length == 2 && val.indexOf('PRESIDENT') != -1))) {
          this.isGradeLeader = true
        }
        //选了老师
        if (val.length > 0 && val.indexOf('TEACHER') != -1) {
          this.isTeacher = true
        }
      },
      back() {
        this.$parent.content = 1;
      },
      confirm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            const {username, password, nickname} = this.formData;
            let param = {username, password, nickname};
            param.roleData = this.setRoleData();
            console.log('-----------', param)
            post(url.addAccount, param).then(res => {
              this.$Message.success({
                content: '提交成功',
                duration: 1,
                onClose: () => {
                }
              })
            }).catch(err => console.log(err));
          }
        })
      },
      setRoleData() {
        let roleData = [];
        this.formData.role.forEach(item => {
          let type = item;
          if (item == 'PRESIDENT') {
            roleData.push({type})
          } else if (item == 'GRADE_LEADER') {
            roleData.push({type, grade: this.formData.gradeId})
          } else if (item == 'CLASS_TEACHER' || item == 'STUDENT') {
            roleData.push({type, clazz: this.formData.clazzName[0]})
          } else if (item == 'TEACHER') {
            let arr = [];
            this.formData.clazzName.forEach(item => arr.push({clazzId: item, subjectId: this.formData.subject}))
            roleData.push({type, teach: arr})
          }
        })
        return roleData;
      },
      cancel() {
        if (this.op == 'modify' || this.op == 'copy') {
          this.$parent.content = 1;
        } else {
          this.$refs.form.resetFields();
        }
      },
      setData(op, data) {
        this.id = '';
        this.op = op;
        if (data) {
          this.id = data.id;
          this.formData.content = data.content;
        }
      },
      getGrades() {
        this.grades = this.subjectData = [];
        this.formData.gradeId = '';
        let stageId = this.formData.stageId;
        get(url.getGradesByStageId + stageId, {}).then(res => {
          if (res) {
            res.forEach(item => this.grades.push({label: item.gradeName, value: item.gradeId}))
          }
        }).catch(err => console.log(err));
        get(url.getSubjectByStageId + stageId, {}).then(res => {
          if (res) {
            let subjectList = res.data.subjectList;
            subjectList.forEach(item => this.subjectData.push({label: item.name, value: item.id}))
          }
        }).catch(err => console.log(err))
      },
      getClazzData() {
        this.clazzData = [];
        this.formData.clazzName = '';
        let gradeId = this.formData.gradeId;
        if (!this.isGradeLeader) {
          get(url.getClazzByGradeId + gradeId, {}).then(res => {
            if (res) {
              let classList = res.clazzList;
              classList.forEach(item => this.clazzData.push({label: item.clazzName, value: item.clazzId}))
            }
          }).catch(err => console.log(err))
        }
      }
    },
    mounted() {
      // this.getGrades();
      // VueEvent.$on('on-open-page', name => this.back());
      // this.getSignList();
      // this.id = this.$store.state.template.id;
      // this.op = this.$store.state.template.operation;
      // if (this.id != '' && this.op != '') {//根据id查询模板
      //   console.log("op:" + this.op + ", id:" + this.id);
      //   this.search(this.id);
      // }
    },
    beforeDestroy() {

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

  .btn_div {
    text-align: center;
    width: 100%;
    margin-top: 40px;
  }

  .radio_len {
    width: 80px;
    text-align: center;
  }
</style>
