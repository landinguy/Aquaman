<template>
  <div ref="AddVue">
    <Modal v-model="addModal" width="640">
      <p slot="header" style="text-align:center">
        <span>{{op}}</span>
      </p>
      <div>
        <Form ref="form" :model="formData" :rules="formValidate" :label-width="100">

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

          <FormItem label="班级" prop="clazzName">
            <Select v-model="formData.clazzName" multiple>
              <Option v-for="item in clazzData" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Form>
      </div>
      <div slot="footer" style="text-align: center">
        <Button type="primary" shape="circle" class="radio_len" @click="confirm">提交</Button>
        <Button type="ghost" shape="circle" class="radio_len" style="margin-left: 20px" @click="cancel">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import url from '@/api/url'
  import {post, get, put, patch} from "@/api/ax"

  export default {
    name: 'Update',
    data() {
      return {
        addModal: false,
        formData: {
          stageId: '',
          gradeId: '',
          clazzName: [],
        },
        id: '',
        formValidate: {
          stageId: [{required: true, message: '请选择学段', trigger: 'change'}],
          gradeId: [{required: true, message: '请选择年级', trigger: 'change'}],
          clazzName: [
            {required: true, type: 'array', min: 1, message: '请选择班级', trigger: 'change'},
            {validator: this.validateClazz, trigger: 'change'}
          ]
        },
        grades: [],
        clazzData: [],
        userIds: [],
        op: ''
      }
    },
    methods: {
      validateClazz(rule, value, callback) {
        if (value.length > 1) {
          callback(new Error("只能选择一个班级"));
        } else {
          callback()
        }
      },
      showModal(op, data) {
        this.op = op;
        this.userIds = data;
        this.addModal = true;
      },
      confirm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            let clazz = this.formData.clazzName[0];
            let userId = this.userIds;
            patch(url.updateStudent, {clazz, userId}).then(res => {
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
                this.$Message.error(`升级失败 [${res.error_msg}]`)
              }
            }).catch(err => console.log(err));
          }
        })
      },
      cancel() {
        this.addModal = false;
      },
      getGrades() {
        this.grades = [];
        this.formData.gradeId = '';
        this.formData.clazzName = [];
        let stageId = this.formData.stageId;
        if (stageId) {
          get(url.getGradesByStageId + stageId, {}).then(res =>
            res.data.forEach(item => this.grades.push({label: item.gradeName, value: item.gradeId}))
          ).catch(err => console.log(err));
        }
      },
      getClazzData() {
        this.clazzData = [];
        this.formData.clazzName = [];
        let gradeId = this.formData.gradeId;
        if (gradeId && !this.isGradeLeader) {
          get(url.getClazzByGradeId + gradeId, {}).then(res => {
            const {clazzList} = res.data;
            clazzList.forEach(item => this.clazzData.push({label: item.clazzName, value: item.clazzId}))
          }).catch(err => console.log(err))
        }
      }
    },
    watch: {
      addModal(curVal, oldVal) {
        if (!curVal) {
          this.$refs.form.resetFields();
          this.id = '';
          this.$parent.userIds = [];
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
