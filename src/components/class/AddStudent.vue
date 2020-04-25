<template>
  <div ref="AddStudentVue">
    <Modal v-model="addModal" width="640">
      <p slot="header" style="text-align:center">
        <span>添加学生</span>
      </p>
      <div>
        <Form ref="form" :model="formData" :rules="formValidate" :label-width="60">
          <FormItem label="姓名" prop="name">
            <Input v-model.trim="formData.name" placeholder="请填写姓名"/>
          </FormItem>
          <FormItem label="账号" prop="accountName">
            <Input v-model.trim="formData.accountName" placeholder="请填写账号"/>
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
  import url from '@/api/url'
  import {$get} from "@/api/ax"

  export default {
    name: 'AddStudent',
    data() {
      return {
        addModal: false,
        formData: {
          name: '',
          accountName: ''
        },
        classId: null,
        formValidate: {
          name: [{required: true, message: '请填写姓名', trigger: 'blur'}],
          accountName: [{required: true, message: '请填写账号', trigger: 'blur'}],
        },
      }
    },
    methods: {
      showModal(classId) {
        if (classId) {
          this.classId = classId;
          this.addModal = true;
        }
      },
      confirm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            let params = {classId: this.classId, name: this.formData.name, accountName: this.formData.accountName};
            $get(url.saveStudent, params).then(res => {
              const {code, msg} = res;
              if (code === 0) {
                this.$Message.success({
                  content: '提交成功',
                  duration: 1,
                  onClose: () => {
                    this.cancel();
                    this.$parent.getData(this.classId);
                  }
                })
              } else {
                this.$Message.error(msg);
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
          this.$refs.form.resetFields();
          this.classId = null;
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
