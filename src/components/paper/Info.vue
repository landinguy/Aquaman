<template>
  <div class="bg">
    <h2>试卷名称</h2>
    <div class="content">
      <template v-for="item in questions">

      </template>
    </div>
  </div>
</template>
<script>
  import url from '@/api/url'
  import {post} from "@/api/ax"

  export default {
    name: 'Info',
    props: {
      title: {type: String, default: "试题练习"},
      questions: {type: Array, default: []}
    },
    data() {
      return {
        formData: {
          type: '',
          content: '',
          answer: '',
          difficulty: '',
        },
        id: '',
        formValidate: {
          type: [{required: true, message: '请选择题型', trigger: 'change'}],
          content: [{required: true, message: '请录入题目内容', trigger: 'blur'}],
          answer: [{required: true, message: '请录入题目答案', trigger: 'blur'}],
          difficulty: [{required: true, message: '请设置难度系数', trigger: 'blur'}],
        },
        op: 'add'
      }
    },
    methods: {
      confirm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            let param = this.formData;
            param.id = this.id;
            post(url.saveExamination, param).then(res => {
              this.$Message.success({
                content: '提交成功',
                duration: 1,
                onClose: () => {
                  this.cancel();
                  this.$parent.search();
                }
              })
            }).catch(err => console.log(err));
          }
        })
      },
      cancel() {
      },
      setData(data) {
        if (data) {
          const {answer, content, id, type, difficulty} = data;
          this.id = id;
          this.formData.type = type.toString();
          this.formData.content = content;
          this.formData.answer = answer;
          this.formData.difficulty = difficulty.toLocaleString();
        }
      }
    },
    watch: {}
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

    .content {
      margin-top: 8px;
    }
  }

  .radio_len {
    width: 80px;
    text-align: center;
  }
</style>
