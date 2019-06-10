<template>
  <div ref="AddVue">
    <Modal v-model="addModal" width="960">
      <p slot="header" style="text-align:center">
        <span>查看试卷</span>
      </p>
      <div class="content">
        <Item :choiceQuestions="choiceQuestions" :answerQuestions="answerQuestions"></Item>
      </div>
      <div slot="footer" style="height: 50px;line-height: 50px">
        <Form ref="form" :model="formData" :rules="formValidate" :label-width="80" style="text-align: center" inline>
          <FormItem label="学段" prop="stageId">
            <Select v-model="formData.stageId" @on-change="getGrades()" class="radio_len">
              <Option value="1">小学</Option>
              <Option value="2">初中</Option>
              <Option value="3">高中</Option>
            </Select>
          </FormItem>
          <FormItem label="年级" prop="gradeId">
            <Select v-model="formData.gradeId" @on-change="getClazzData()" class="radio_len">
              <Option v-for="item in grades" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="班级" prop="clazzName">
            <Select v-model="formData.clazzName" class="width" multiple :max-tag-count="1">
              <Option v-for="item in clazzData" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <Checkbox v-model="all" @on-change="isSelectAll" style="position: relative;top: -10px">全选</Checkbox>
          <FormItem>
            <Button type="primary" shape="circle" size="small" class="radio_len" @click="confirm">布置作业</Button>
          </FormItem>
        </Form>
      </div>
    </Modal>
  </div>
</template>
<script>
  import url from '@/api/url'
  import {post, put, get} from "@/api/ax"
  import Item from './component/Item'

  export default {
    name: 'Add',
    components: {Item},
    data() {
      return {
        addModal: false,
        formData: {stageId: '1', gradeId: '', clazzName: []},
        id: '',
        formValidate: {
          stageId: [{required: true, message: '请选择学段', trigger: 'change'}],
          gradeId: [{required: true, message: '请选择年级', trigger: 'change'}],
          clazzName: [{required: true, type: 'array', min: 1, message: '请选择班级', trigger: 'change'}]
        },
        grades: [], clazzData: [], choiceQuestions: [], answerQuestions: [],
        all: false
      }
    },
    methods: {
      isSelectAll() {
        this.formData.clazzName = []
        if (this.all) {
          this.clazzData.forEach(item => this.formData.clazzName.push(item.value))
        }
      },
      getQuestions(id) {
        this.choiceQuestions = []
        this.answerQuestions = []
        get(url.examPapers + `/${id}/question`, {}).then(res => {
          res.data.forEach(item => {
            const {questionTypeId} = item
            if (questionTypeId == 2 || questionTypeId == 3) this.choiceQuestions.push(item)
            if (questionTypeId == 20) this.answerQuestions.push(item)
          })
        }).catch(err => console.log(err))
      },
      getGrades() {
        const {stageId} = this.formData
        this.grades = []
        this.formData.gradeId = ''
        this.clazzData = []
        this.formData.clazzName = []

        if (stageId) {
          get(url.getGradesByStageId + stageId, {}).then(res =>
            res.data.forEach(item => this.grades.push({label: item.gradeName, value: item.gradeId})
            )).catch(err => console.log(err))
        }
      },
      getClazzData() {
        const {gradeId} = this.formData
        this.clazzData = []
        this.formData.clazzName = []

        if (gradeId) {
          get(url.getClazzByGradeId + gradeId, {}).then(res => {
            const {clazzList} = res.data;
            clazzList.forEach(item =>
              this.clazzData.push({label: item.clazzName, value: item.clazzId})
            )
          }).catch(err => console.log(err))
        }
      },
      showModal(id) {
        this.id = id
        this.getQuestions(id)
        this.addModal = true

      },
      cancel() {
        this.addModal = false
      },
      confirm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.$Message.success('布置成功')
            // post(url.addGrade, this.formData).then(res => {
            //   if (res.ret_code == 400) {
            //     this.$Message.error('该年级已存在')
            //   } else if (res.ret_code == 0) {
            //     this.$Message.success({
            //       content: '提交成功',
            //       duration: 1,
            //       onClose: () => {
            //         this.cancel()
            //         this.$parent.getData()
            //       }
            //     })
            //   }
            // }).catch(err => console.log(err))

          }
        })
      }
    },
    watch: {
      addModal(curVal, oldVal) {
        if (!curVal) {
          this.$refs.form.resetFields()
          this.id = ''
        } else {
          this.getGrades()
        }
      }
    }
  }
</script>
<style lang="less">
  .width {
    width: 160px;
    text-align: left;
  }

  .radio_len {
    width: 80px;
    text-align: center;
  }

  .content {
    height: 320px;
    overflow: auto;
    padding: 0px 5px;
  }
</style>
