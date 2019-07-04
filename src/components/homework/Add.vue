<template>
  <div ref="AddVue">
    <Modal v-model="addModal" width="1200" class-name="vertical-center-modal" :mask-closable="false">
      <p slot="header" style="text-align:center">
        <span>查看试卷</span>
      </p>
      <div class="content">
        <PaperContent ref="PaperContent" :questions="questions">

          <!--:choiceQuestions="choiceQuestions" :answerQuestions="answerQuestions"-->
          <!--:readingComprehension="readingComprehension" :spelling="spelling" :writing="writing"-->
          <!--:calculationQuestions="calculationQuestions" :fillQuestions="fillQuestions"-->
          <!--:exploreQuestions="exploreQuestions" :inferenceQuestions="inferenceQuestions"-->
          <!--:comprehensiveQuestions="comprehensiveQuestions" :judgmentQuestions="judgmentQuestions"-->
          <!--:discussQuestions="discussQuestions" :shortAnswerQuestions="shortAnswerQuestions"-->
        </PaperContent>
      </div>
      <div slot="footer" style="height: 100px">
        <Form ref="form" :model="formData" :rules="formValidate" :label-width="80" style="text-align: center">
          <div class="row">
            <FormItem label="学段" prop="stageId">
              <Select size="small" v-model="formData.stageId" @on-change="getGrades()" class="radio_len">
                <Option value="1">小学</Option>
                <Option value="2">初中</Option>
                <Option value="3">高中</Option>
              </Select>
            </FormItem>
            <FormItem label="年级" prop="gradeId">
              <Select size="small" v-model="formData.gradeId" @on-change="getClazzData()" class="radio_len">
                <Option v-for="item in grades" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem label="班级" prop="classList">
              <Select size="small" v-model="formData.classList" class="width" multiple :max-tag-count="1">
                <Option v-for="item in clazzData" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <Checkbox v-model="all" @on-change="isSelectAll" style="position: relative;top: -10px;margin-left: 10px">
              班级全选
            </Checkbox>
          </div>
          <div class="row">
            <FormItem label="开始时间" prop="startTs">
              <DatePicker v-model="formData.startTs" type="datetime" placeholder="请选择开始时间" class="width" size="small"
                          :editable="false" @on-change="changeTs('start',$event)"/>
            </FormItem>
            <FormItem label="结束时间" prop="endTs">
              <DatePicker v-model="formData.endTs" type="datetime" placeholder="请选择结束时间" class="width" size="small"
                          :editable="false" @on-change="changeTs('end',$event)"/>
            </FormItem>
            <FormItem label="试卷名称" prop="name">
              <Input size="small" v-model.trim="formData.name" placeholder="请填写试卷名称" class="width"/>
            </FormItem>
            <FormItem label="备注" prop="desc">
              <Input v-model="formData.desc" placeholder="请填写备注" class="width" size="small"/>
            </FormItem>
            <Button type="primary" shape="circle" size="small" class="radio_len" @click="confirm"
                    style="margin-left: 32px;position: relative;top: -10px">
              布置作业
            </Button>
          </div>
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
        startTsVal: '',
        endTsVal: '',
        addModal: false,
        id: '',
        formData: {
          stageId: '1', gradeId: '', classList: [],
          name: '', desc: '无', startTs: '', endTs: ''
        },
        formValidate: {
          stageId: [{required: true, message: '请选择学段', trigger: 'change'}],
          gradeId: [{required: true, message: '请选择年级', trigger: 'change'}],
          name: [{required: true, message: '请填写试卷名称', trigger: 'blur'}],
          startTs: [{required: true, message: '请选择开始时间', trigger: 'change'}],
          endTs: [{required: true, message: '请选择结束时间', trigger: 'change'}],
          classList: [{required: true, type: 'array', min: 1, message: '请选择班级', trigger: 'change'}],
        },
        grades: [], clazzData: [], questions: [],
        // choiceQuestions: [], answerQuestions: [], readingComprehension: [],
        // spelling: [], writing: [], calculationQuestions: [], fillQuestions: [], exploreQuestions: [],
        // inferenceQuestions: [], comprehensiveQuestions: [], judgmentQuestions: [], discussQuestions: [],
        // shortAnswerQuestions: [],
        all: false,
        // choiceArr: ['2', '3', '6'],
        // answerArr: ['20']
      }
    },
    methods: {
      changeTs(flag, val) {
        // console.log(flag, val)
        if (val) flag == 'start' ? this.formData.startTs = val : this.formData.endTs = val
        else flag == 'start' ? this.formData.startTs = '' : this.formData.endTs = ''
      },
      isSelectAll() {
        this.formData.classList = []
        if (this.all) {
          this.clazzData.forEach(item => this.formData.classList.push(item.value))
        }
      },
      getQuestions(id) {
        this.questions = []
        // this.choiceQuestions = []
        // this.answerQuestions = []
        // this.readingComprehension = []
        // this.spelling = []
        // this.writing = []
        // this.calculationQuestions = []
        // this.fillQuestions = []
        // this.exploreQuestions = []
        // this.inferenceQuestions = []
        // this.comprehensiveQuestions = []
        // this.judgmentQuestions = []
        // this.discussQuestions = []
        // this.shortAnswerQuestions = []
        get(url.examPapers + `/${id}/question`, {}).then(res => {
          this.questions = res.data
          // res.data.forEach(item => {
          //   const {questionTypeId} = item
          //   if (this.choiceArr.indexOf(questionTypeId) != -1) this.choiceQuestions.push(item)
          //   if (this.answerArr.indexOf(questionTypeId) != -1) this.answerQuestions.push(item)
          //   if (questionTypeId == 25) this.readingComprehension.push(item)
          //   if (questionTypeId == 32) this.spelling.push(item)
          //   if (questionTypeId == 30) this.writing.push(item)
          //   if (questionTypeId == 19) this.calculationQuestions.push(item)
          //   if (questionTypeId == 18) this.fillQuestions.push(item)
          //   if (questionTypeId == 40) this.exploreQuestions.push(item)
          //   if (questionTypeId == 43) this.inferenceQuestions.push(item)
          //   if (questionTypeId == 23) this.comprehensiveQuestions.push(item)
          //   if (questionTypeId == 39) this.judgmentQuestions.push(item)
          //   if (questionTypeId == 22) this.discussQuestions.push(item)
          //   if (questionTypeId == 21) this.shortAnswerQuestions.push(item)
          // })
        }).catch(err => console.log(err))
      },
      getGrades() {
        const {stageId} = this.formData
        if (stageId) {
          this.grades = []
          this.formData.gradeId = ''
          this.clazzData = []
          this.formData.classList = []
          get(url.getGradesByStageId + stageId, {}).then(res =>
            res.data.forEach(item => this.grades.push({label: item.gradeName, value: item.gradeId})
            )).catch(err => console.log(err))
        }
      },
      getClazzData() {
        const {gradeId} = this.formData
        if (gradeId) {
          this.clazzData = []
          this.formData.classList = []
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
      validateTime() {
        const {startTs, endTs} = this.formData
        if (new Date(startTs) < new Date()) {
          this.$Message.warning('开始时间不能早于当前时间')
          return false
        }
        if (startTs > endTs) {
          this.$Message.warning('开始时间不能晚于结束时间')
          return false
        }
        return true
      },
      confirm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            if (!this.validateTime()) return

            let examPaperId = this.id
            let subjectId = this.$parent.params.subjectId
            let questionScore = this.$refs.PaperContent.questionScore
            const params = {...this.formData, examPaperId, subjectId, questionScore}
            console.log(params)
            post(url.assignPaper, params).then(res => {
              const {error_msg, ret_code} = res
              if (ret_code == 0) {
                this.$Message.success({
                  content: '提交成功',
                  duration: 1,
                  onClose: () => this.cancel()
                })
              } else {
                this.$Message.error(error_msg ? error_msg : '提交失败')
              }
            }).catch(err => console.log(err))
          }
        })
      }
    },
    watch: {
      addModal(curVal, oldVal) {
        if (!curVal) {
          this.$refs.form.resetFields()
          this.id = ''
          this.$refs.PaperContent.questionScore = []
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
  }

  .row {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .vertical-center-modal {
    display: flex;
    align-items: center;
    justify-content: center;

    .ivu-modal {
      top: 0;
    }
  }
</style>
