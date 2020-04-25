<template>
  <div ref="PublishVue">
    <Modal v-model="isShowModal" width="640">
      <p slot="header" style="text-align:center">
        <span>发布试卷</span>
      </p>
      <div>
        <Form ref="form" :model="formData" :rules="formValidate" :label-width="100">
          <FormItem label="限制答题时间" prop="limitAnswerTime">
            <RadioGroup v-model="formData.limitAnswerTime">
              <Radio label="1">是</Radio>
              <Radio label="0">否</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="答题时间" prop="answerTs" v-if="formData.limitAnswerTime==='1'">
            <Input v-model.trim="formData.answerTs" placeholder="请设置答题时间(单位：分钟)"/>
          </FormItem>
          <FormItem label="截止时间" prop="endTs">
            <DatePicker v-model="formData.endTs" type="datetime" placeholder="请设置截止时间" style="width: 200px"/>
          </FormItem>
        </Form>
      </div>
      <div slot="footer" style="text-align: center">
        <Button type="primary" shape="circle" class="radio_len" @click="publish">发布</Button>
        <Button type="ghost" shape="circle" class="radio_len" style="margin-left: 20px" @click="cancel">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import url from '@/api/url'
  import {post} from "@/api/ax"
  import {timestampToTime} from "@/libs/util"

  export default {
    name: 'Publish',
    data() {
      return {
        isShowModal: false,
        formData: {
          limitAnswerTime: '1',
          answerTs: '30',
          endTs: ''
        },
        formValidate: {
          limitAnswerTime: [{required: true, message: '请选择是否限制答题时间', trigger: 'change'}],
          answerTs: [{required: true, message: '请设置答题时间(单位：分钟)', trigger: 'blur'}]
        },
        paperId: null
      }
    },
    methods: {
      showModal(paperId) {
        this.paperId = paperId;
        this.isShowModal = true;
      },
      publish() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            let {limitAnswerTime, answerTs, endTs} = this.formData;
            if (limitAnswerTime === '0') {
              limitAnswerTime = false;
              answerTs = -1
            } else {
              limitAnswerTime = true;
            }
            if (endTs) {
              endTs = timestampToTime(endTs);
            }
            let param = {paperId: this.paperId, limitAnswerTime, answerTs, endTs};
            // alert(JSON.stringify(param))
            post(url.publishPaper, param).then(res => {
              const {code, msg} = res;
              if (code === 0) {
                this.$Message.success({
                  content: '提交成功',
                  duration: 1,
                  onClose: () => {
                    this.cancel();
                    this.$router.push({name: 'publish'});
                  }
                })
              } else {
                this.$Message.error(msg)
              }
            }).catch(err => console.log(err));
          }
        })
      },
      cancel() {
        this.isShowModal = false;
      }
    },
    watch: {
      isShowModal(curVal, oldVal) {
        if (!curVal) {
          this.$refs.form.resetFields();
          this.paperId = null
        }
      }
    }
  }
</script>
<style lang="less">
  .radio_len {
    width: 80px;
    text-align: center;
  }
</style>
