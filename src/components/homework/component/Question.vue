<template>
  <div>
    <div class="questionType" v-if="data.length!=0">
      <h2>{{title}}</h2>
      <template v-for="(item,index) in data">
        <div class="question">
          <h3>{{index+1}}.<span v-html="item.stem"></span></h3>
          <template v-for="childItem in item.listChildQuestion">
            <span v-html="childItem.stem"></span>
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
    methods: {},
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
