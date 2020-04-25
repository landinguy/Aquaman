<template>
  <div ref="PaperVue" class="bg">
    <div class="clock" v-if="operation==='answer'">
      <Icon type="clock"></Icon>
      <span>{{time}}</span>
    </div>
    <h2>{{title}} （总分：{{score}}）</h2>
    <div class="content">
      <div class="content-part" v-if="XZQuestions.length>0">
        <h3>选择题 （{{calculateScore(XZQuestions)}}分）</h3>
        <template v-for="(item,index) in XZQuestions">
          <Question :index="index+1" type="1" :detail="item" :operation="operation"
                    :is-show-practise-result="isShowPractiseResult"
                    @on-answer="onAnswer"/>
        </template>
      </div>
      <div class="content-part" v-if="PDQuestions.length>0">
        <h3>判断题 （{{calculateScore(PDQuestions)}}分）</h3>
        <template v-for="(item,index) in PDQuestions">
          <Question :index="index+1" type="2" :detail="item" :operation="operation"
                    :is-show-practise-result="isShowPractiseResult"
                    @on-answer="onAnswer"/>
        </template>
      </div>
      <div class="content-part" v-if="TKQuestions.length>0">
        <h3>填空题 （{{calculateScore(TKQuestions)}}分）</h3>
        <template v-for="(item,index) in TKQuestions">
          <Question :index="index+1" type="3" :detail="item" :operation="operation"
                    :is-show-practise-result="isShowPractiseResult"
                    @on-answer="onAnswer"/>
        </template>
      </div>
    </div>
    <div class="analysis" v-if="operation==='viewAnswer'">
      <h3>学生答题分析:</h3>
      <p>
        答题结果：容易（{{analysis.easyCorrect}}/{{analysis.easy}}）; 中等难度（{{analysis.mediumCorrect}}/{{analysis.medium}}）;
        较难（{{analysis.difficultCorrect}}/{{analysis.difficult}}）
      </p>
      <p>
        掌握情况：该学⽣针对较为容易知识<span>{{graspingState(analysis.easyCorrect,analysis.easy)}}</span>；
        中等难度知识<span>{{graspingState(analysis.mediumCorrect,analysis.medium)}}</span>；
        较难知识<span>{{graspingState(analysis.difficultCorrect,analysis.difficult)}}</span>。
      </p>
    </div>
    <div style="text-align: center;margin-top: 16px">
      <Button type="primary" shape="circle" class="radio_len" @click="setPaperInfo"
              v-if="operation === 'viewAndSave' && questions.length > 0">
        保存试卷
      </Button>
      <Button type="primary" shape="circle" class="radio_len" @click="publish" v-if="operation==='viewAndPublish'">
        发布试卷
      </Button>
      <Button type="primary" shape="circle" class="radio_len" @click="submitAnswer" v-if="operation==='answer'">
        提交答案
      </Button>
      <Button type="primary" shape="circle" @click="viewResult" v-if="operation==='practise'">
        查看练习结果
      </Button>
    </div>
    <Modal
      v-model="isShowModal"
      title="设置试卷名称"
      @on-ok="confirm"
      @on-cancel="cancel">
      <Input v-model.trim="paperName" placeholder="请填写试卷名称"/>
    </Modal>
    <Publish ref="PublishVue"/>
  </div>
</template>
<script>
  import Question from "./Question";
  import {post} from "@/api/ax"
  import url from '@/api/url'
  import Publish from "./Publish";

  export default {
    name: 'Paper',
    props: {
      title: {type: String, default: "试卷预览"},
      operation: {type: String, default: "view"},
      questions: {type: Array, default: () => []},
      paperId: {type: Number, default: null},
      publishId: {type: Number, default: null},
      answerTs: {type: Number, default: null},
    },
    data() {
      return {
        isShowModal: false,
        XZQuestions: [],
        PDQuestions: [],
        TKQuestions: [],
        score: 0,
        answer: {},
        paperName: '',
        time: '',
        internal: null,
        isShowPractiseResult: false,
        analysis: {
          easy: 0,
          easyCorrect: 0,
          medium: 0,
          mediumCorrect: 0,
          difficult: 0,
          difficultCorrect: 0
        }
      }
    },
    components: {Question, Publish},
    methods: {
      viewResult() {
        // let answer = this.answer;
        // this.questions.forEach(it => {
        //   if (answer[it.id] == null) answer[it.id] = ''
        // });
        this.isShowPractiseResult = true;
      },
      calculateScore(questions) {
        let score = 0;
        questions.forEach(it => score += it.score);
        return score;
      },
      submitAnswer() {
        this.$Modal.confirm({
          title: '确认提示',
          content: '确认要提交吗?',
          onOk: () => this.submit()
        });
      },
      submit() {
        let {paperId, publishId, answer} = this;
        this.questions.forEach(it => {
          if (answer[it.id] == null) answer[it.id] = ''
        });
        answer = JSON.stringify(answer);
        // alert(JSON.stringify({paperId, publishId, answer}))
        post(url.saveReply, {paperId, publishId, answer}).then(res => {
          const {code} = res;
          if (code === 0) {
            this.$Message.success({
              content: '提交成功',
              duration: 1,
              onClose: () => {
                this.$router.push({name: 'reply'});
              }
            })
          } else {
            this.$Message.error('提交失败,请联系管理员!')
          }
        }).catch(err => console.log(err));
      },
      publish() {
        this.$refs.PublishVue.showModal(this.paperId)
      },
      setPaperInfo() {
        this.isShowModal = true
      },
      onAnswer({questionId, answer}) {
        this.answer[questionId] = answer;
        // console.log(JSON.stringify(this.answer))
      },
      confirm() {
        if (this.paperName === '') {
          this.$Message.warning('试卷名称不能为空！');
          return
        }
        let examinations = this.questions.map(it => it.id);
        let params = {title: this.paperName, examinations: examinations};
        post(url.savePaper, params).then(res => {
          if (res.code === 0) {
            this.$Message.success({
              content: '提交成功',
              duration: 1,
              onClose: () => {
                this.cancel();
                this.$router.push({name: 'paper'})
                //跳转到试卷管理页面 todo
                // this.$parent.search();
              }
            })
          } else {
            this.$Message.error(res.msg)
          }
        }).catch(err => console.log(err));
      },
      cancel() {
        this.isShowModal = false
      },
      setData(data) {
        if (data) {
          // const {answer, content, id, type, difficulty} = data;
          // this.id = id;
          // this.formData.type = type.toString();
          // this.formData.content = content;
          // this.formData.answer = answer;
          // this.formData.difficulty = difficulty.toLocaleString();
        }
      },
      countdown() {
        let time = this.answerTs * 60;
        this.getTime(time);
        this.internal = setInterval(() => this.getTime(time--), 1000);
      },
      getTime(time) {
        let now = new Date(time * 1000);
        let minutes = now.getMinutes();
        minutes = minutes < 10 ? '0' + minutes : minutes;
        let seconds = now.getSeconds();
        seconds = seconds < 10 ? '0' + seconds : seconds;
        this.time = minutes + ' : ' + seconds;
        if (time === 0) {
          window.clearInterval(this.internal);
          this.$Modal.confirm({
            title: '答题结束',
            content: '确认提交此次作答吗？取消后将不保存此次作答记录！',
            onOk: () => this.submit(),
            onCancel: () => this.$parent.content = 1
          });
        }
      },
      analysisResult() {
        this.questions.forEach(it => {
          const {difficulty, reply, answer} = it;
          if (difficulty === 1 || difficulty === 2) {
            this.analysis.easy++;
            if (reply == answer) this.analysis.easyCorrect++;
          } else if (difficulty === 3) {
            this.analysis.medium++;
            if (reply == answer) this.analysis.mediumCorrect++;
          } else {
            this.analysis.difficult++;
            if (reply == answer) this.analysis.difficultCorrect++;
          }
        })
      },
      graspingState(a, b) {
        let c = a / b;
        return c >= 0.8 ? '掌握很好' : c >= 0.4 ? '掌握⼀般' : '掌握较差';
      }
    },
    mounted() {
      if (this.questions) {
        this.questions.forEach(it => {
          if (it.type === 1) {
            this.XZQuestions.push(it)
          } else if (it.type === 2) {
            this.PDQuestions.push(it)
          } else if (it.type === 3) {
            this.TKQuestions.push(it)
          }
          this.score += it.score;
        });
      }
      if (this.operation === 'answer') this.countdown();
      if (this.operation === 'viewAnswer') this.analysisResult()
    },
    destroyed() {
      if (this.internal) window.clearInterval(this.internal);
    },
    watch: {
      isShowModal(curVal, oldVal) {
        if (!curVal) {
          this.paperName = '';
        }
      }
    }
  }
</script>
<style scoped lang="less">
  .bg {
    background-color: white;
    width: 100%;
    height: 100%;
    padding: 16px;

    h2 {
      display: flex;
      justify-content: center;
    }

    .clock {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      position: relative;
      top: -32px;

      span {
        margin-left: 8px;
      }
    }

    .content {
      margin-top: 8px;

      &-part {
        margin-bottom: 16px;

        h3 {
          margin-bottom: 8px;
        }
      }
    }

    .analysis {
      margin-top: 32px;
      font-weight: bold;

      span {
        color: red;
      }
    }
  }

  .radio_len {
    width: 80px;
    text-align: center;
  }
</style>
