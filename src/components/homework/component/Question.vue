<template>
  <div>
    <div class="questionType">
      <div class="question">
        <div style="display: flex">
          <InputNumber :value="0" :min="0" size="small" @on-change="changeScore(question.id,$event)"
                       class="score"></InputNumber>
          <h3>
            {{index}}.<span v-html="question.stem"></span>
          </h3>
        </div>
        <template v-for="childItem in question.listChildQuestion">
          <div class="child-question">
            <InputNumber :value="0" :min="0" size="small" @on-change="changeScore(question.id,$event,childItem.id)"
                         class="score"></InputNumber>
            <span v-html="childItem.stem"></span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'Question',
    props: {
      question: {type: Object},
      index: {type: Number}
    },
    data() {
      return {}
    },
    methods: {
      changeScore(questionId, score, cid = null) {
        this.$emit('on-change-score', {questionId, score, cid})
      }
    },
    computed: {},
    mounted() {
    }
  }
</script>
<style lang="less" scoped>
  .questionType {
    margin-bottom: 16px;

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

      .child-question {
        margin-bottom: 5px;
        display: flex;
      }
    }
  }
</style>
