<template>
  <div ref="AddGoodsVue">
    <Modal v-model="addModal" width="640">
      <p slot="header" style="text-align:center">
        <span>添加商品</span>
      </p>
      <div>
        <Form ref="form" :model="formData" :rules="formValidate" :label-width="80">
          <FormItem label="商品名称" prop="goodsName">
            <Input v-model.trim="formData.goodsName" placeholder="请填写商品名称"/>
          </FormItem>
          <FormItem label="商品类别" prop="goodsType">
            <Select v-model="formData.goodsType">
              <Option v-for="item in goodsTypeData" :value="item.name">{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="商品价格" prop="price">
            <Input v-model.trim="formData.price" placeholder="请填写商品价格"/>
          </FormItem>
        </Form>
      </div>
      <div slot="footer" style="text-align: center">
        <Button type="primary" shape="circle" class="radio_len" @click="confirm">提交</Button>
        <Button type="ghost" shape="circle" class="radio_len" style="margin-left: 20px" @click="cancel">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import goodsApi from '@/api/goods'
  import {validateNumber} from '@/libs/util'

  export default {
    name: 'AddGoods',
    data() {
      return {
        addModal: false,
        formData: {
          goodsName: '',
          goodsType: '',
          price: '',
        },
        formValidate: {
          goodsName: [{required: true, message: '请填写商品名称', trigger: 'blur'}],
          goodsType: [{required: true, message: '请选择商品类别', trigger: 'change'}],
          price: [
            {required: true, message: '请填写商品价格', trigger: 'blur'},
            {validator: validateNumber, trigger: 'blur'}
          ],
        },
        goodsTypeData: []
      }
    },
    methods: {
      getGoodsType() {
        goodsApi.getGoodsType().then(res => {
          this.goodsTypeData = res.data
        }).finally(err => console.log(err))
      },
      confirm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            const {price} = this.formData;
            this.formData.price = Number.parseInt(price);
            goodsApi.addGoods(this.formData).then(res => {
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
      showModal(data) {
        this.getGoodsType();
        this.addModal = true;
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
