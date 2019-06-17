<template>
  <div>
    <div class="questionType" v-if="data.length!=0">
      <h2>{{title}}</h2>
      <template v-for="(item,index) in data">
        <div class="question">
          <div style="display: flex">
            <InputNumber value="0" :min="0" size="small" @on-change="changeScore(item.id,$event)"
                         class="score"></InputNumber>
            <h3>
              {{index+1}}.<span v-html="item.stem"></span>
            </h3>
          </div>
          <template v-for="childItem in item.listChildQuestion">
            <div class="child-question">
              <InputNumber value="0" :min="0" size="small" @on-change="changeScore(item.id,$event,childItem.id)"
                           class="score"></InputNumber>
              <span v-html="childItem.stem"></span>
            </div>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'Question',
    props: {
      title: {type: String},
      data: {type: Array},
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
