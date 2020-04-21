<template>
  <div class="question">
    {{index}}. <span>{{detail.content}}</span>
    <template v-if="operation==='viewAnswer'" style="margin-left: 16px">
      <span v-if="answer===detail.answer" style="color: green">【正确】</span>
      <span v-else style="color: red">【错误】</span>
    </template>
    <Input v-model.trim="answer" :placeholder="placeholder" @on-blur="onBlur" :disabled="operation==='viewAnswer'"
           v-if="operation==='answer' || operation==='viewAnswer'"/>
  </div>
</template>
<script>

  export default {
    name: 'Question',
    props: {
      index: {type: Number},
      type: {type: String},
      operation: {type: String, default: 'view'},
      detail: {type: Object}
    },
    data() {
      return {
        placeholder: '',
        answer: ''
      }
    },
    methods: {
      onBlur() {
        this.$emit('on-answer', {questionId: this.detail.id, answer: this.answer})
      },
      setPlaceholder() {
        let type = this.type;
        let text = type == 1 ? '请填写大写字母。若为多选，多个选项间不能有任何连接符(正确示例：AB)' : type == 2 ? '判断对错，正确填 对，错误填 错' : '请填写答案';
        this.placeholder = text;
      }
    },
    mounted() {
      this.setPlaceholder();
      const {reply} = this.detail;
      this.answer = reply ? reply : '';
    }
  }
</script>
<style scoped lang="less">
  .question {
    margin-bottom: 16px;
  }

  .radio_len {
    width: 80px;
    text-align: center;
  }
</style>
