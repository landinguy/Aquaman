<template>
  <div ref="AddVue">
    <Modal v-model="addModal" width="640">
      <p slot="header" style="text-align:center">
        <span>添加年级</span>
      </p>
      <div>
        <Form ref="form" :model="formData" :rules="formValidate" :label-width="100" width="540px">
          <FormItem label="学段" prop="stageId">
            <Select v-model="formData.stageId">
              <Option value="1">小学</Option>
              <Option value="2">初中</Option>
              <Option value="3">高中</Option>
            </Select>
          </FormItem>
          <FormItem label="年级名称" prop="gradeName">
            <Input v-model.trim="formData.gradeName" placeholder="请填写年级名称"/>
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
  import {post} from "@/api/ax"

  export default {
    name: 'Add',
    data() {
      return {
        addModal: false,
        formData: {stageId: '1', gradeName: ''},
        id: '',
        formValidate: {
          stageId: [{required: true, message: '请选择学段', trigger: 'change'}],
          gradeName: [{required: true, message: '请填写年级', trigger: 'blur'}]
        },
      }
    },
    methods: {
      cancel() {
        this.addModal = false;
      },
      confirm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            post(url.addGrade, this.formData).then(res => {
              if (res.ret_code && res.ret_code == 400) {
                this.$Message.error('该年级已存在');
              } else if (res == 'success') {
                this.$Message.success({
                  content: '提交成功',
                  duration: 1,
                  onClose: () => {
                    this.cancel();
                    this.$parent.getData();
                  }
                })
              }
            }).catch(err => console.log(err))
          }
        })
      },
      setData(op, data) {
        this.id = '';
        this.op = op;
        if (data) {
          this.id = data.id;
          this.formData.content = data.content;
        }
        this.addModal = true;
      }
    },
    watch: {
      addModal(curVal, oldVal) {
        if (!curVal) this.$refs.form.resetFields()
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
