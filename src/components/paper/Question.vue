<template>
  <div class="question">
    {{index}}. <span>{{content}}</span>
    <Input v-model.trim="answer" placeholder="请填写答案" @on-blur="onBlur" v-if="operation==='answer'"/>
  </div>
</template>
<script>

  export default {
    name: 'Question',
    props: {
      index: {type: Number},
      questionId: {type: Number},
      content: {type: String},
      operation: {type: String, default: 'view'},
    },
    data() {
      return {
        answer: '',
        formValidate: {
          answer: [{required: true, message: '请录入题目答案', trigger: 'blur'}],
        },
      }
    },
    methods: {
      onBlur() {
        this.$emit('on-answer', {questionId: this.questionId, answer: this.answer})
      },
      confirm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            // let param = this.formData;
            // param.id = this.id;
            // post(url.saveExamination, param).then(res => {
            //   this.$Message.success({
            //     content: '提交成功',
            //     duration: 1,
            //     onClose: () => {
            //       this.cancel();
            //       this.$parent.search();
            //     }
            //   })
            // }).catch(err => console.log(err));
          }
        })
      },
      cancel() {
      }
    },
    watch: {}
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
