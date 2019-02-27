<template>
  <div ref="AddVue">
    <Modal v-model="addModal">
      <p slot="header" style="text-align:center">
        <span>{{op}}签名</span>
      </p>
      <div>
        <Form ref="signForm" :model="signData" :rules="signValidate" :label-width="100">
          <FormItem label="签名内容" prop="content">
            <Input v-model.trim="signData.content" placeholder="3~8个字，无论汉字、英文、数字皆记为1个字" :maxlength="8"
                   class="input_len"/>
          </FormItem>
        </Form>
      </div>
      <div slot="footer" style="text-align: center">
        <Button type="primary" @click="confirm">提交</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import axios from 'axios';
  import url from '@/api/url'
  import baseUrl from "@/libs/url"

  export default {
    name: 'Add',
    data() {
      return {
        fileName: '',
        addModal: false,
        op: '添加',
        signData: {content: '', uploadValid: ''},
        file: null,
        id: '',
        signValidate: {
          content: [{required: true, message: '请填写签名', trigger: 'blur'}],
          uploadValid: [{required: true, message: '请上传签名授权书', trigger: 'blur'}]
        },
      }
    },
    methods: {
      confirm() {
        this.$refs.signForm.validate((valid) => {
          if (valid) {
            let data = new FormData();
            data.append('content', this.signData.content);
            data.append('files', this.file);
            data.append('id', this.id);
            axios.post(baseUrl.base + url.createSign, data, {headers: {'Content-Type': 'multipart/form-data'}}).then(res => {
              if (res.data.code == 0) {
                this.$Message.success('提交成功');
                this.addModal = false;
                this.file = null;
                this.$parent.search();
              } else {
                this.$Message.error(res.data.msg)
              }
            });
          }
        })
      },
      setData(op, data) {
        this.id = '';
        this.op = op;
        if (data) {
          this.id = data.id;
          this.signData.content = data.content;
        }
        this.addModal = true;
      }
    },
    watch: {
      addModal(curVal, oldVal) {
        if (curVal) {
        } else {
          this.$refs.signForm.resetFields();
        }
      }
    }
  }
</script>
<style lang="less">
  .input_len {
    width: 100%;
  }

  .sign_tip {
    .input_len;
    margin-top: 10px;
    line-height: 20px;
    color: gray;
  }
</style>
