<template>
  <div ref="AddVue">
    <Modal v-model="addModal" width="640">
      <p slot="header" style="text-align:center">
        <span>上传文件</span>
      </p>
      <div>
        <Form ref="form" :model="formData" :rules="formValidate" :label-width="100">
          <FormItem label="加密方式" prop="encryption_type">
            <Select v-model="formData.encryption_type">
              <Option value="1">Base64</Option>
              <Option value="2">AES</Option>
            </Select>
          </FormItem>
          <FormItem label="上传文件">
            <Upload ref="upload"
                    :action="uploadUrl"
                    :show-upload-list="false"
                    :before-upload="handleBeforeUpload"
                    :on-success="handleSuccess"
                    :with-credentials="true"
                    :data="formData">
              <Button type="ghost" class="radio_len">上传</Button>
            </Upload>
          </FormItem>
        </Form>
      </div>
      <div slot="footer" style="text-align: center">
        <Button type="ghost" shape="circle" class="radio_len" style="margin-left: 20px" @click="cancel">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import url from '@/api/url'
  import baseUrl from "@/libs/url"
  import {handleSpinCustom} from "@/libs/util"
  import {Spin} from 'iview'

  export default {
    name: 'Add',
    data() {
      return {
        addModal: false,
        formData: {
          encryption_type: '1',
          uid: null
        },
        formValidate: {
          encryption_type: [{required: true, message: '请选择加密类型', trigger: 'change'}]
        },
        uploadUrl: baseUrl.base + url.upload
      }
    },
    methods: {
      handleSuccess(res, file) {
        Spin.hide();
        const {code, msg} = res;
        if (code === 0) {
          this.$Message.success({
            content: '上传成功',
            duration: 1,
            onClose: () => {
              this.cancel();
              this.$parent.search();
            }
          })
        } else {
          this.$Message.error(msg ? msg : '上传失败')
        }
      },
      handleBeforeUpload(file) {
        // let index = file.name.lastIndexOf(".");
        // let type = file.name.substring(index + 1);
        // let arr = ['txt', 'jpg'];
        // if (arr.indexOf(type.toLowerCase()) === -1) {
        //   this.$Message.error('请上传txt,jpg文件');
        //   return false;
        // }
        handleSpinCustom();
        this.formData.uid = this.$parent.accountId;
        if (this.$refs.upload.fileList.length > 0) {
          this.$refs.upload.clearFiles();
        }
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
  .radio_len {
    width: 80px;
    text-align: center;
  }
</style>
