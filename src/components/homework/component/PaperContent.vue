<template>
  <div>
    <div class="questionType" v-if="choiceQuestions.length!=0">
      <h2>选择题</h2>
      <template v-for="(item,index) in choiceQuestions">
        <div class="question">
          <h3>{{index+1}}.<span v-html="item.stem"></span></h3>
          <template v-for="optionItem in item.questionOptions">
            <span v-html="optionItem.option"></span>&nbsp;&nbsp;
            <span v-html="optionItem.value"></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </template>
          <template v-for="childItem in item.listChildQuestion">
            <span v-html="childItem.stem"></span>
          </template>
        </div>
      </template>
    </div>
    <Question title="填空题" :data="fillQuestions"></Question>
    <Question title="判断题" :data="judgmentQuestions"></Question>
    <Question title="单词拼写" :data="spelling"></Question>
    <Question title="阅读理解" :data="readingComprehension"></Question>
    <Question title="书面表达" :data="writing"></Question>
    <Question title="推断题" :data="inferenceQuestions"></Question>
    <Question title="探究题" :data="exploreQuestions"></Question>
    <Question title="论述题" :data="discussQuestions"></Question>
    <Question title="解答题" :data="answerQuestions"></Question>
    <Question title="简答题" :data="shortAnswerQuestions"></Question>
    <Question title="计算题" :data="calculationQuestions"></Question>
    <Question title="综合题" :data="comprehensiveQuestions"></Question>


    <!--<div class="noData" v-if="isNoData">-->
    <!--<h2>暂无内容</h2>-->
    <!--</div>-->
  </div>
</template>
<script>
  import Question from "./Question";

  export default {
    name: 'PaperContent',
    components: {Question},
    props: {
      choiceQuestions: {type: Array},
      answerQuestions: {type: Array},
      readingComprehension: {type: Array},
      spelling: {type: Array},
      writing: {type: Array},
      calculationQuestions: {type: Array},
      fillQuestions: {type: Array},
      exploreQuestions: {type: Array},
      inferenceQuestions: {type: Array},
      comprehensiveQuestions: {type: Array},
      judgmentQuestions: {type: Array},
      discussQuestions: {type: Array},
      shortAnswerQuestions: {type: Array},
    },
    component: {Question},
    data() {
      return {}
    },
    methods: {},
    computed: {
      // isNoData() {
      //   return this.choiceQuestions.length == 0 && this.choiceQuestions.length == 0
      // }
    },
    mounted() {
    }
  }
</script>
<style lang="less" scoped>
  .questionType {
    margin-bottom: 16px;

    h2 {
      margin-bottom: 10px;
    }

    .question {
      text-align: left;
      margin-bottom: 16px;

      h3 {
        margin-bottom: 5px;
      }
    }
  }
</style>
