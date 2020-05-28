<template>
  <div ref="AddVue">
    <Modal v-model="addModal" width="640">
      <p slot="header" style="text-align:center">
        <span>商户对账</span>
      </p>
      <div>
        <Form ref="form" :model="formData" :rules="formValidate" :label-width="80">
          <FormItem label="商户id" prop="outid">
            <Input v-model.trim="formData.outid" placeholder="请填写商户id"/>
          </FormItem>
          <FormItem label="支付金额" prop="pay_amount">
            <Input v-model.trim="formData.pay_amount" placeholder="请填写支付金额"/>
          </FormItem>
          <FormItem label="支付笔数" prop="pay_count">
            <Input v-model.trim="formData.pay_count" placeholder="请填写支付笔数"/>
          </FormItem>
          <FormItem label="退款金额" prop="refund_amount">
            <Input v-model.trim="formData.refund_amount" placeholder="请填写退款金额"/>
          </FormItem>
          <FormItem label="退款笔数" prop="refund_count">
            <Input v-model.trim="formData.refund_count" placeholder="请填写退款笔数"/>
          </FormItem>
        </Form>
      </div>
      <div slot="footer" style="text-align: center">
        <Button type="primary" shape="circle" class="radio_len" @click="submit">提交</Button>
        <Button type="ghost" shape="circle" class="radio_len" style="margin-left: 20px" @click="cancel">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import url from '@/api/url'
  import {post} from "../../api/ax";

  export default {
    name: 'Add',
    data() {
      return {
        addModal: false,
        formData: {
          outid: '',
          pay_amount: '',
          pay_count: '',
          refund_amount: '',
          refund_count: '',
        },
        formValidate: {
          outid: [{required: true, message: '请填写商户id', trigger: 'blur'}],
          pay_amount: [{required: true, message: '请填写支付金额', trigger: 'blur'}],
          pay_count: [{required: true, message: '请填写支付笔数', trigger: 'blur'}],
          refund_amount: [{required: true, message: '请填写退款金额', trigger: 'blur'}],
          refund_count: [{required: true, message: '请填写退款笔数', trigger: 'blur'}],
        }
      }
    },
    methods: {
      showModal() {
        this.addModal = true;
      },
      submit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            post(url.addBill, {...this.formData}).then(res => {
              const {code, msg} = res;
              if (code === 0) {
                this.$Message.success({
                  content: '提交成功',
                  duration: 1,
                  onClose: () => {
                    this.cancel();
                    this.$parent.search();
                  }
                })
              } else {
                this.$Message.error(`对账失败,${msg}`)
              }
            }).catch(err => console.log(err));
          }
        })
      },
      cancel() {
        this.addModal = false;
      }
    },
    watch: {
      addModal(curVal, oldVal) {
        if (!curVal) {
          this.$refs.form.resetFields()
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
