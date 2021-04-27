<template>
  <div ref="AddWorkRecordVue">
    <Modal v-model="addModal" width="640">
      <p slot="header" style="text-align:center">
        <span>上工登记</span>
      </p>
      <div>
        <Form ref="form" :model="formData" :rules="formValidate" :label-width="80">
          <FormItem label="姓名" prop="username">
            <Input v-model.trim="formData.username" placeholder="请填写姓名"/>
          </FormItem>
          <FormItem label="工号" prop="workNumber">
            <Input v-model.trim="formData.workNumber" placeholder="请填写工号"/>
          </FormItem>
          <FormItem label="手机号" prop="phoneNumber">
            <Input v-model.trim="formData.phoneNumber" placeholder="请填写手机号"/>
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
  import workApi from '@/api/work'

  export default {
    name: 'AddWorkRecord',
    data() {
      return {
        addModal: false,
        formData: {
          username: '',
          phoneNumber: '',
          workNumber: '',
        },
        userId: '',
        formValidate: {
          username: [{required: true, message: '请填写姓名', trigger: 'blur'}],
          workNumber: [{required: true, message: '请填写工号', trigger: 'blur'}],
          phoneNumber: [
            {required: true, message: '请填写手机号', trigger: 'blur'},
            {validator: this.validatePhone, trigger: 'blur'}
          ],
        }
      }
    },
    methods: {
      showModal(data) {
        if (data) {
          const {username, phoneNumber, workNumber} = data;
          this.formData.username = username;
          this.formData.phoneNumber = phoneNumber;
          this.formData.workNumber = workNumber;
          this.userId = data.id;
        }
        this.addModal = true;
      },
      confirm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            let params = this.formData;
            params.userId = this.userId;
            workApi.saveWorkRecord(params).then(res => {
              const {code, msg} = res;
              if (code === 0) {
                this.$Message.success('上工登记成功')
              } else {
                this.$Message.warning(msg);
              }
              this.cancel();
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
          this.$refs.form.resetFields();
          this.userId = '';
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
