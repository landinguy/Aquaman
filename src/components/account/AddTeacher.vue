<template>
  <div ref="AddVue">
    <Modal v-model="addModal" width="640">
      <p slot="header" style="text-align:center">
        <span>{{op==='add'?'添加':'编辑'}}用户</span>
      </p>
      <div>
        <Form ref="form" :model="formData" :rules="formValidate" :label-width="100">
          <template v-if="step===1">
            <FormItem label="账号" prop="username">
              <Input v-model.trim="formData.username" placeholder="请填写账号"/>
            </FormItem>
            <FormItem label="密码" prop="password" v-if="op==='add'">
              <Input v-model.trim="formData.password" type="password" placeholder="请填写密码"/>
            </FormItem>
            <FormItem label="姓名" prop="nickname">
              <Input v-model.trim="formData.nickname" placeholder="请填写姓名"/>
            </FormItem>
            <FormItem label="角色" prop="role">
              <Select v-model="formData.role" multiple @on-change="changeRole">
                <Option value="PRESIDENT">校领导</Option>
                <Option value="GRADE_LEADER">年级主任</Option>
                <Option value="CLASS_TEACHER">班主任</Option>
                <Option value="TEACHER">任课教师</Option>
              </Select>
            </FormItem>
          </template>
          <template v-if="step===2">
            <!-- 选了年级主任 -->
            <template v-if="isGradeLeader">
              <h3>配置年级主任信息</h3>
              <FormItem label="学段" prop="g_stageId">
                <Select v-model="formData.g_stageId" @on-change="getGrades('g')">
                  <Option value="1">小学</Option>
                  <Option value="2">初中</Option>
                  <Option value="3">高中</Option>
                </Select>
              </FormItem>
              <FormItem label="年级" prop="g_gradeId">
                <Select v-model="formData.g_gradeId" placement="bottom">
                  <Option v-for="item in g_grades" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </FormItem>
            </template>
            <!-- 选了班主任 -->
            <template v-if="isClassTeacher">
              <h3>配置班主任信息</h3>
              <FormItem label="学段" prop="c_stageId">
                <Select v-model="formData.c_stageId" @on-change="getGrades('c')">
                  <Option value="1">小学</Option>
                  <Option value="2">初中</Option>
                  <Option value="3">高中</Option>
                </Select>
              </FormItem>
              <FormItem label="年级" prop="c_gradeId">
                <Select v-model="formData.c_gradeId" placement="bottom" @on-change="getClazzData('c')">
                  <Option v-for="item in c_grades" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </FormItem>
              <FormItem label="班级" prop="c_clazzName">
                <Select v-model="formData.c_clazzName">
                  <Option v-for="item in c_clazzData" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </FormItem>
            </template>
            <template v-if="isTeacher">
              <h3>配置老师信息</h3>
              <FormItem label="学段" prop="t_stageId">
                <Select v-model="formData.t_stageId" @on-change="getGrades('t')">
                  <Option value="1">小学</Option>
                  <Option value="2">初中</Option>
                  <Option value="3">高中</Option>
                </Select>
              </FormItem>
              <FormItem label="年级" prop="t_gradeId">
                <Select v-model="formData.t_gradeId" placement="bottom" @on-change="getClazzData('t')">
                  <Option v-for="item in t_grades" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </FormItem>
              <FormItem label="班级" prop="t_clazzName">
                <Select v-model="formData.t_clazzName" multiple>
                  <Option v-for="item in t_clazzData" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </FormItem>
              <FormItem label="科目" prop="subject">
                <Select v-model="formData.subject" placement="bottom" multiple>
                  <Option v-for="item in subjectData" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </FormItem>
            </template>
          </template>
        </Form>
      </div>
      <div slot="footer" style="text-align: center">
        <Button v-if="step===1" type="primary" shape="circle" class="radio_len" @click="next">{{btnText}}</Button>
        <template v-if="step===2">
          <Button v-if="isGradeLeader || isClassTeacher || isTeacher" type="ghost" shape="circle" class="radio_len"
                  style="margin-right: 20px" @click="previous">上一步
          </Button>
          <Button type="primary" shape="circle" class="radio_len" @click="confirm">提交</Button>
        </template>
      </div>
    </Modal>
  </div>
</template>
<script>
  import url from '@/api/url'
  import {post, get, put} from "@/api/ax"

  export default {
    name: 'Add',
    data() {
      return {
        addModal: false,
        formData: {
          username: '', password: '', nickname: '', role: [], g_stageId: '', c_stageId: '', t_stageId: '',
          g_gradeId: '', c_gradeId: '', t_gradeId: '', c_clazzName: '', t_clazzName: [], subject: []
        },
        id: '',
        formValidate: {
          username: [{required: true, message: '请填写账号', trigger: 'blur'}],
          password: [{required: true, message: '请填写密码', trigger: 'blur'}],
          nickname: [{required: true, message: '请填写姓名', trigger: 'blur'}],
          role: [{required: true, type: 'array', min: 1, message: '请选择至少一个角色', trigger: 'change'}],
          g_stageId: [{required: true, message: '请选择学段', trigger: 'change'}],
          c_stageId: [{required: true, message: '请选择学段', trigger: 'change'}],
          t_stageId: [{required: true, message: '请选择学段', trigger: 'change'}],
          g_gradeId: [{required: true, message: '请选择年级', trigger: 'change'}],
          c_gradeId: [{required: true, message: '请选择年级', trigger: 'change'}],
          t_gradeId: [{required: true, message: '请选择年级', trigger: 'change'}],
          c_clazzName: [{required: true, message: '请选择班级', trigger: 'change'}],
          t_clazzName: [{required: true, type: 'array', min: 1, message: '请选择班级', trigger: 'change'}],
          subject: [{required: true, type: 'array', min: 1, message: '请选择科目', trigger: 'change'}],
        },
        isPresident: false,
        isGradeLeader: false,
        isClassTeacher: false,
        isTeacher: false,
        g_grades: [], c_grades: [], t_grades: [],
        c_clazzData: [], t_clazzData: [],
        subjectData: [],
        op: 'add',
        step: 1,
        btnText: '提交'
      }
    },
    methods: {
      previous() {
        this.step = 1
      },
      next() {
        if (this.btnText === '下一步') {
          this.step = 2
        } else if (this.btnText === '提交') {
          this.confirm()
        }
      },
      showModal(data) {
        if (data) {
          this.op = 'edit';
          this.setData(data);
        } else {
          this.$refs.form.resetFields();
        }
        this.addModal = true;
      },
      changeRole(val) {
        if (val) {
          this.isPresident = this.isGradeLeader = this.isClassTeacher = this.isTeacher = false
          if (val.length === 1 && val.indexOf('PRESIDENT') != -1) {
            this.isPresident = true
            this.btnText = '提交'
            return
          } else {
            this.btnText = '下一步'
          }
          //选了校长
          if (val.length > 0 && val.indexOf('PRESIDENT') != -1) this.isPresident = true
          //选了年级主任
          if (val.length > 0 && val.indexOf('GRADE_LEADER') != -1) this.isGradeLeader = true
          //选了年级主任
          if (val.length > 0 && val.indexOf('CLASS_TEACHER') != -1) this.isClassTeacher = true
          //选了老师
          if (val.length > 0 && val.indexOf('TEACHER') != -1) this.isTeacher = true
        }
      },
      confirm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            const {username, password, nickname} = this.formData;
            if (this.id == '') {//添加
              let param = {username, password, nickname};
              param.roleData = this.setRoleData();
              console.log('-----------', param)
              post(url.addAccount, param).then(res => {
                if (res.ret_code == 0) {
                  this.$Message.success({
                    content: '提交成功',
                    duration: 1,
                    onClose: () => {
                      this.cancel();
                      this.$parent.search();
                    }
                  })
                } else {
                  this.$Message.error(`添加失败 [${res.error_msg}]`)
                }
              }).catch(err => console.log(err));
            } else {
              let userId = this.id;
              let roleData = this.setRoleData();
              put(url.updateTeacher, {userId, username, nickname, roleData}).then(res => {
                if (res.ret_code == 0) {
                  this.$Message.success({
                    content: '提交成功',
                    duration: 1,
                    onClose: () => {
                      this.cancel();
                      this.$parent.search();
                    }
                  })
                } else {
                  this.$Message.error(`修改失败 [${res.error_msg}]`)
                }
              }).catch(err => console.log(err));

            }
          }
        })
      },
      setRoleData() {
        let roleData = [];
        this.formData.role.forEach(item => {
          let type = item;
          if (item === 'PRESIDENT') {
            roleData.push({type})
          } else if (item === 'GRADE_LEADER') {
            roleData.push({type, grade: this.formData.g_gradeId})
          } else if (item === 'CLASS_TEACHER') {
            roleData.push({type, clazz: this.formData.c_clazzName})
          } else if (item === 'TEACHER') {
            let arr = [];
            const {t_clazzName, subject} = this.formData
            for (let i in t_clazzName) {
              if (subject.length === 1) {
                arr.push({clazzId: t_clazzName[i], subjectId: subject[0]})
              } else if (subject.length > 1) {
                arr.push({clazzId: t_clazzName[i], subjectId: subject[i]})
              }
            }
            roleData.push({type, teach: arr})
          }
        })
        return roleData;
      },
      cancel() {
        this.addModal = false
      },
      setData(data) {
        if (data) {
          this.formData.role = []
          const {username, nickname, roleInfoList, userId} = data;
          this.id = userId;
          this.formData.username = username;
          this.formData.nickname = nickname;
          console.log("roleInfoList----", roleInfoList)
          roleInfoList.forEach(r => this.formData.role.push(r.type))
        }
      },
      getGrades(type) {
        let stageId = ''
        if (type === 'g') {
          this.g_grades = []
          this.formData.g_gradeId = ''
          stageId = this.formData.g_stageId
        } else if (type === 'c') {
          this.c_grades = []
          this.formData.c_gradeId = ''
          this.c_clazzData = []
          this.formData.c_clazzName = ''
          stageId = this.formData.c_stageId
        } else if (type === 't') {
          this.t_grades = []
          this.formData.t_gradeId = ''
          this.t_clazzData = []
          this.formData.t_clazzName = []
          this.subjectData = []
          this.formData.subject = []
          stageId = this.formData.t_stageId
        }

        if (stageId) {
          get(url.getGradesByStageId + stageId, {}).then(res =>
            res.data.forEach(item => {
              if (type === 'g') this.g_grades.push({label: item.gradeName, value: item.gradeId})
              else if (type === 'c') this.c_grades.push({label: item.gradeName, value: item.gradeId})
              else if (type === 't') this.t_grades.push({label: item.gradeName, value: item.gradeId})
            })
          ).catch(err => console.log(err));
          //教师角色才需选取科目
          if (type === 't') {
            get(url.getSubjectByStageId + stageId, {}).then(res => {
              if (res) {
                let subjectList = res.data.subjectList;
                subjectList.forEach(item => this.subjectData.push({label: item.name, value: item.id}))
              }
            }).catch(err => console.log(err))
          }
        }
      },
      getClazzData(type) {
        let gradeId = ''
        if (type === 'c') {
          this.c_clazzData = []
          this.formData.c_clazzName = ''
          gradeId = this.formData.c_gradeId
        } else if (type === 't') {
          this.t_clazzData = []
          this.formData.t_clazzName = []
          gradeId = this.formData.t_gradeId
        }

        if (gradeId) {
          get(url.getClazzByGradeId + gradeId, {}).then(res => {
            const {clazzList} = res.data;
            clazzList.forEach(item => {
              if (type === 'c') this.c_clazzData.push({label: item.clazzName, value: item.clazzId})
              else if (type === 't') this.t_clazzData.push({label: item.clazzName, value: item.clazzId})
            })
          }).catch(err => console.log(err))
        }
      }
    },
    watch: {
      addModal(curVal, oldVal) {
        if (!curVal) {
          this.op = 'add'
          this.id = ''
          this.step = 1
          this.btnText = '提交'
          this.formData = {
            username: '', password: '', nickname: '', role: [], g_stageId: '', c_stageId: '', t_stageId: '',
            g_gradeId: '', c_gradeId: '', t_gradeId: '', c_clazzName: '', t_clazzName: [], subject: []
          }
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
