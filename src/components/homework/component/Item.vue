<template>
  <div>
    <div class="questionType" v-if="choiceQuestions.length!=0">
      <h2>选择题</h2>
      <template v-for="(item,index) in choiceQuestions">
        <div class="question">
          <h3>{{index+1}}.
            <span v-html="item.stem"></span>
          </h3>
          <template v-for="optionItem in item.questionOptions">
            <span v-html="optionItem.option"></span>&nbsp;&nbsp;
            <span v-html="optionItem.value"></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </template>
        </div>
      </template>
    </div>
    <div class="questionType" v-if="answerQuestions.length!=0">
      <h2>解答题</h2>
      <template v-for="(item,index) in answerQuestions">
        <div class="question">
          <h3>{{index+1}}.
            <span v-html="item.stem"></span>
          </h3>
          <template v-for="childItem in item.listChildQuestion">
            <span v-html="childItem.stem"></span>
          </template>
          <!--<p>A 2或8&nbsp;&nbsp;&nbsp;&nbsp;B ﹣2或8&nbsp;&nbsp;&nbsp;&nbsp;C 2或﹣8&nbsp;&nbsp;&nbsp;&nbsp;D ﹣2或﹣8</p>-->
        </div>
      </template>
    </div>
    <!--<div class="noData" v-if="isNoData">-->
    <!--<h2>暂无内容</h2>-->
    <!--</div>-->

  </div>
</template>
<script>
  import url from '@/api/url'
  import {post, get} from "@/api/ax"
  import {showTip, timestampToTime} from '@/libs/util'

  export default {
    name: 'Item',
    props: {
      choiceQuestions: {type: Array},
      answerQuestions: {type: Array}
    },
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
