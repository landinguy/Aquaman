<template>
  <div ref="PaperVue" class="bg">
    <h2>{{title}}</h2>
    <div class="content">
      <div class="content-part" v-if="XZQuestions.length>0">
        <h3>选择题</h3>
        <template v-for="(item,index) in XZQuestions">
          <Question :index="index+1" type="1" :question-id="item.id" :content="item.content" :operation="operation"
                    @on-answer="onAnswer"/>
        </template>
      </div>
      <div class="content-part" v-if="PDQuestions.length>0">
        <h3>判断题</h3>
        <template v-for="(item,index) in PDQuestions">
          <Question :index="index+1" type="2" :question-id="item.id" :content="item.content" :operation="operation"
                    @on-answer="onAnswer"/>
        </template>
      </div>
      <div class="content-part" v-if="TKQuestions.length>0">
        <h3>填空题</h3>
        <template v-for="(item,index) in TKQuestions">
          <Question :index="index+1" type="3" :question-id="item.id" :content="item.content" :operation="operation"
                    @on-answer="onAnswer"/>
        </template>
      </div>
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
    </div>
    <Modal
      v-model="isShowModal"
      title="设置试卷名称"
      @on-ok="confirm"
      @on-cancel="cancel">
      <Input v-model.trim="paperName" placeholder="请填写试卷名称"/>
    </Modal>
    <Publish ref="PublishVue"></Publish>
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
    },
    data() {
      return {
        isShowModal: false,
        XZQuestions: [],
        PDQuestions: [],
        TKQuestions: [],
        answer: {},
        paperName: ''
      }
    },
    components: {Question, Publish},
    methods: {
      submitAnswer() {
        //todo 提交前验证
        this.$Modal.confirm({
          title: '确认提示',
          content: '确认要提交吗?',
          onOk: () => this.submit()
        });
      },
      submit() {
        let {paperId, publishId, answer} = this;
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
        });
      }
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

    .content {
      margin-top: 8px;

      &-part {
        margin-bottom: 16px;

        h3 {
          margin-bottom: 8px;
        }
      }
    }
  }

  .radio_len {
    width: 80px;
    text-align: center;
  }
</style>
