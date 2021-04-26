<template>
  <div ref="AddGoodsTypeVue">
    <Modal v-model="addModal" width="640">
      <p slot="header" style="text-align:center">
        <span>添加商品类别</span>
      </p>
      <div>
        <Form ref="form" :model="formData" :rules="formValidate" :label-width="80">
          <FormItem label="类别名称" prop="name">
            <Input v-model.trim="formData.name" placeholder="请填写类别名称"/>
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

  export default {
    name: 'AddGoodsType',
    data() {
      return {
        addModal: false,
        formData: {
          name: ''
        },
        formValidate: {
          name: [{required: true, message: '请填写类别名称', trigger: 'blur'}],
        },
      }
    },
    methods: {
      confirm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            goodsApi.addGoodsType(this.formData).then(res => {
              this.$Message.success({
                content: '提交成功',
                duration: 1,
                onClose: () => {
                  this.cancel();
                }
              })
            }).catch(err => console.log(err));
          }
        })
      },
      showModal(data) {
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

</style>
