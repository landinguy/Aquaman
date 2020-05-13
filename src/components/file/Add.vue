<template>
  <div ref="AddVue">
    <Modal v-model="addModal" width="640">
      <p slot="header" style="text-align:center">
        <span>上传文件</span>
      </p>
      <div>
        <Form ref="form" :model="formData" :rules="formValidate" :label-width="100">
          <FormItem label="文件" prop="content">
            <Input v-model.trim="formData.content" type="textarea" :rows="4" placeholder="请录入题目内容"/>
          </FormItem>

          <FormItem label="加密方式" prop="type">
            <Select v-model="formData.type">
              <Option value="1">Base64</Option>
              <Option value="2">AES</Option>
            </Select>
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
        formData: {
          type: '',
          content: '',
          answer: '',
          difficulty: '',
          score: '',
        },
        id: '',
        formValidate: {
          type: [{required: true, message: '请选择加密类型', trigger: 'change'}],
          content: [{required: true, message: '请录入题目内容', trigger: 'blur'}]
        }
      }
    },
    methods: {
      showModal(data) {
        if (data) {
          this.setData(data);
        }
        this.addModal = true;
      },
      confirm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            let param = this.formData;
            param.id = this.id;
            post(url.upload, param).then(res => {
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
        this.addModal = false;
      },
      setData(data) {
        if (data) {
          const {answer, content, id, type, difficulty, score} = data;
          this.id = id;
          this.formData.type = type.toString();
          this.formData.content = content;
        }
      }
    },
    watch: {
      addModal(curVal, oldVal) {
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
