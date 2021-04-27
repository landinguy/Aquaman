<template>
  <div ref="UpdatePwdVue">
    <Modal v-model="isShowModal" width="640">
      <p slot="header" style="text-align:center">
        <span>修改密码</span>
      </p>
      <div>
        <Form ref="form" :model="formData" :rules="formValidate" :label-width="80">
          <FormItem label="密码" prop="password">
            <Input v-model.trim="formData.password" type="password" placeholder="请填写密码"/>
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

  import {$get} from "@/api/ax"

  export default {
    name: 'UpdatePwd',
    data() {
      return {
        isShowModal: false,
        formData: {password: ''},
        id: '',
        formValidate: {password: [{required: true, message: '请填写密码', trigger: 'blur'}]}
      }
    },
    methods: {
      showModal(data) {
        if (data) {
          this.setData(data);
        }
        this.isShowModal = true;
      },
      confirm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            let param = this.formData;
            param.id = this.id;
            $get(url.updatePassword, param).then(res => {
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
        this.isShowModal = false;
      },
      setData(data) {
        if (data) this.id = data.id;
      }
    },
    watch: {
      isShowModal(curVal, oldVal) {
        if (!curVal) {
          this.$refs.form.resetFields();
          this.id = '';
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
