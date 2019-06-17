<template>
  <div>
    <div class="questionType" v-if="choiceQuestions.length!=0">
      <h2>选择题</h2>
      <template v-for="(item,index) in choiceQuestions">
        <div class="question">
          <div style="display: flex">
            <InputNumber value="0" :min="0" size="small"
                         @on-change="changeScore({questionId:item.id,score:$event,cid:null})"
                         class="score"></InputNumber>
            <h3>
              {{index+1}}.<span v-html="item.stem"></span>
            </h3>
          </div>

          <div class="questionOptions">
            <template v-for="optionItem in item.questionOptions">
              <div>
                <span v-html="optionItem.option"></span>
                <span v-html="optionItem.value"></span>
              </div>
            </template>
          </div>
          <template v-for="childItem in item.listChildQuestion">
            <div style="display: flex">
              <InputNumber value="0" :min="0" size="small"
                           @on-change="changeScore({questionId:item.id,score:$event,cid:childItem.id})"
                           class="score"></InputNumber>
              <span v-html="childItem.stem"></span>
            </div>
          </template>
        </div>
      </template>
    </div>
    <Question @on-change-score="changeScore" title="填空题" :data="fillQuestions"></Question>
    <Question @on-change-score="changeScore" title="判断题" :data="judgmentQuestions"></Question>
    <Question @on-change-score="changeScore" title="单词拼写" :data="spelling"></Question>
    <Question @on-change-score="changeScore" title="阅读理解" :data="readingComprehension"></Question>
    <Question @on-change-score="changeScore" title="书面表达" :data="writing"></Question>
    <Question @on-change-score="changeScore" title="推断题" :data="inferenceQuestions"></Question>
    <Question @on-change-score="changeScore" title="探究题" :data="exploreQuestions"></Question>
    <Question @on-change-score="changeScore" title="论述题" :data="discussQuestions"></Question>
    <Question @on-change-score="changeScore" title="解答题" :data="answerQuestions"></Question>
    <Question @on-change-score="changeScore" title="简答题" :data="shortAnswerQuestions"></Question>
    <Question @on-change-score="changeScore" title="计算题" :data="calculationQuestions"></Question>
    <Question @on-change-score="changeScore" title="综合题" :data="comprehensiveQuestions"></Question>

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
      return {
        questionScore: []
      }
    },
    methods: {
      changeScore({questionId, score, cid}) {
        for (let item of this.questionScore) {
          if (item.questionId == questionId) {
            if (cid) {
              if (!item.children) {
                item.children = []
                item.children.push({questionId: cid, score})
                return
              }
              for (let childItem of item.children) {
                if (childItem.questionId == cid) {
                  childItem.score = score
                  return
                }
              }
              item.children.push({questionId: cid, score})
            } else {
              item.score = score
            }
            return
          }
        }
        if (!cid) {
          this.questionScore.push({questionId, score})
        } else {
          this.questionScore.push({questionId, children: [{questionId: cid, score}]})
        }
        // console.log(this.questionScore)
      }
    },
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

    .questionOptions {
      margin-left: 60px;

      div {
        display: inline-block;
        margin-right: 32px;
      }
    }

    h2 {
      margin-bottom: 10px;
      margin-left: 60px;
    }

    .question {
      text-align: left;
      margin-bottom: 16px;

      h3 {
        margin-bottom: 5px;
      }

      .score {
        width: 50px;
        margin-right: 10px;
        flex-shrink: 0;
      }
    }
  }
</style>
