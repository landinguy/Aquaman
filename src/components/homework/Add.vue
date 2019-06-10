<template>
  <div ref="AddVue">
    <Modal v-model="addModal" width="960">
      <p slot="header" style="text-align:center">
        <span>查看试卷</span>
      </p>
      <div class="content">
        <PaperContent :choiceQuestions="choiceQuestions" :answerQuestions="answerQuestions"
                      :readingComprehension="readingComprehension" :spelling="spelling" :writing="writing"
                      :calculationQuestions="calculationQuestions" :fillQuestions="fillQuestions"
                      :exploreQuestions="exploreQuestions" :inferenceQuestions="inferenceQuestions"
                      :comprehensiveQuestions="comprehensiveQuestions" :judgmentQuestions="judgmentQuestions"
                      :discussQuestions="discussQuestions" :shortAnswerQuestions="shortAnswerQuestions"
        >
        </PaperContent>
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
  import PaperContent from './component/PaperContent'

  export default {
    name: 'Add',
    components: {PaperContent},
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
        grades: [], clazzData: [], choiceQuestions: [], answerQuestions: [], readingComprehension: [],
        spelling: [], writing: [], calculationQuestions: [], fillQuestions: [], exploreQuestions: [],
        inferenceQuestions: [], comprehensiveQuestions: [], judgmentQuestions: [], discussQuestions: [],
        shortAnswerQuestions: [],
        all: false,
        choiceArr: ['2', '3', '6'],
        answerArr: ['20'],
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
        this.readingComprehension = []
        this.spelling = []
        this.writing = []
        this.calculationQuestions = []
        this.fillQuestions = []
        this.exploreQuestions = []
        this.inferenceQuestions = []
        this.comprehensiveQuestions = []
        this.judgmentQuestions = []
        this.discussQuestions = []
        this.shortAnswerQuestions = []
        get(url.examPapers + `/${id}/question`, {}).then(res => {
          res.data.forEach(item => {
            const {questionTypeId} = item
            if (this.choiceArr.indexOf(questionTypeId) != -1) this.choiceQuestions.push(item)
            if (this.answerArr.indexOf(questionTypeId) != -1) this.answerQuestions.push(item)
            if (questionTypeId == 25) this.readingComprehension.push(item)
            if (questionTypeId == 32) this.spelling.push(item)
            if (questionTypeId == 30) this.writing.push(item)
            if (questionTypeId == 19) this.calculationQuestions.push(item)
            if (questionTypeId == 18) this.fillQuestions.push(item)
            if (questionTypeId == 40) this.exploreQuestions.push(item)
            if (questionTypeId == 43) this.inferenceQuestions.push(item)
            if (questionTypeId == 23) this.comprehensiveQuestions.push(item)
            if (questionTypeId == 39) this.judgmentQuestions.push(item)
            if (questionTypeId == 22) this.discussQuestions.push(item)
            if (questionTypeId == 21) this.shortAnswerQuestions.push(item)
          })
        }).catch(err => console.log(err))
      },
      getGrades() {
        const {stageId} = this.formData
        if (stageId) {
          this.grades = []
          this.formData.gradeId = ''
          this.clazzData = []
          this.formData.clazzName = []
          get(url.getGradesByStageId + stageId, {}).then(res =>
            res.data.forEach(item => this.grades.push({label: item.gradeName, value: item.gradeId})
            )).catch(err => console.log(err))
        }
      },
      getClazzData() {
        const {gradeId} = this.formData
        if (gradeId) {
          this.clazzData = []
          this.formData.clazzName = []
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
