<template>
  <div ref="AddVue">
    <Modal v-model="addModal" width="640">
      <p slot="header" style="text-align:center">
        <span>添加商品</span>
      </p>
      <div>
        <Form ref="form" :model="formData" :rules="formValidate" :label-width="80">
          <FormItem label="名称" prop="name">
            <Input v-model.trim="formData.name" placeholder="请填写商品名称"/>
          </FormItem>
          <FormItem label="价格" prop="price">
            <Input v-model.trim="formData.price" placeholder="请填写商品价格"/>
          </FormItem>
          <FormItem label="类别" prop="type">
            <Select v-model="formData.type" class="width">
              <Option v-for="item in types" :value="item.id.toString()" :key="item.id">{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="上传图片" prop="image">
            <Upload ref="upload"
                    :action="uploadUrl"
                    :format="['jpg']"
                    :show-upload-list="true"
                    :before-upload="handleBeforeUpload"
                    :on-success="handleSuccess"
                    :with-credentials="true">
              <Button type="ghost" class="radio_len">上传</Button>
            </Upload>
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
  import baseUrl from "@/libs/url"
  import {post} from "../../api/ax";

  export default {
    name: 'Add',
    props: {
      types: {
        type: Array,
        default() {
          return []
        }
      },
    },
    data() {
      return {
        addModal: false,
        formData: {
          name: null,
          price: null,
          type: null,
          image: null
        },
        formValidate: {
          name: [{required: true, message: '请填写商品名称', trigger: 'blur'}],
          price: [{required: true, message: '请填写商品价格', trigger: 'blur'}],
          type: [{required: true, message: '请选择商品类别', trigger: 'change'}],
          image: [{required: true, message: '请上传图片', trigger: 'blur'}],
        },
        uploadUrl: baseUrl.base + url.upload
      }
    },
    methods: {
      handleSuccess(res, file) {
        const {code, msg, data} = res;
        if (code === 0) {
          this.$Message.success({
            content: '上传成功',
            duration: 1,
            onClose: () => {
              this.formData.image = data;
              this.$refs.form.validate();
            }
          })
        } else {
          this.$Message.error(msg ? msg : '上传失败')
        }
      },
      handleBeforeUpload(file) {
        let index = file.name.lastIndexOf(".");
        let type = file.name.substring(index + 1);
        let arr = ['jpg'];
        if (arr.indexOf(type.toLowerCase()) === -1) {
          this.$Message.error('请上传jpg文件');
          return false;
        }
        if (this.$refs.upload.fileList.length > 0) {
          this.$refs.upload.clearFiles();
        }
      },
      showModal(data) {
        this.addModal = true;
      },
      submit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            post(url.addGoods, {...this.formData}).then(res => {
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
                this.$Message.error(`添加商品失败,${msg}`)
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
