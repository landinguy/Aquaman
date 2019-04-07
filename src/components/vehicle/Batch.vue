<template>
  <div>
    <Modal v-model="addModal" width="640">
      <p slot="header" style="text-align:center">
        <span>批量操作</span>
      </p>
      <div>
        <Form ref="form" :model="formData" :rules="formValidate" :label-width="100">
          <FormItem label="数据类型" prop="type">
            <RadioGroup v-model="formData.type">
              <Radio label="vehicle" disabled><span>车辆信息</span></Radio>
              <Radio label="peccancy" disabled><span>违章信息</span></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="文件" prop="uploadValid">
            <Upload action=""
                    :format="['txt']"
                    :before-upload="handleBeforeUpload"
                    :with-credentials="true"
                    style="display: inline-block">
              <Button icon="ios-cloud-upload-outline">上传文件</Button>
            </Upload>
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
  import {mapMutations, mapGetters} from 'vuex'
  import url from '@/api/url'
  import baseUrl from "@/libs/url"
  import {post, get, put} from "@/api/ax"
  import axios from 'axios';

  export default {
    name: 'Batch',
    data() {
      return {
        addModal: false,
        formData: {
          type: '',
          uploadValid: ''
        },
        formValidate: {
          type: [{required: true, message: '请选择数据类型', trigger: 'change'}],
          uploadValid: [{required: true, message: '请选择要上传的文件', trigger: 'blur'}],
        },
        file: null,
      }
    },
    methods: {
      handleBeforeUpload(file) {
        let index = file.name.lastIndexOf(".")
        let type = file.name.substring(index + 1)

        if (type.toUpperCase() !== 'TXT') {
          this.$Message.error('请上传txt文件')
          return false;
        }
        this.file = file
        this.formData.uploadValid = 'uploadValid'
        this.$Message.success('文件上传成功')
        return false
      },
      showModal(type) {
        this.formData.type = type
        this.addModal = true
      },
      confirm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            let data = new FormData();
            data.append('type', this.formData.type)
            data.append('files', this.file)
            axios.post(baseUrl.base + url.upload, data, {headers: {'Content-Type': 'multipart/form-data'}}).then(res => {
              const {code, msg} = res.data
              if (code == 0) {
                this.addModal = false
                this.file = null
                this.formData.uploadValid = ''
                this.$Message.success({
                  content: '提交成功',
                  duration: 1.5,
                  onClose: () => this.$parent.search()
                })
              } else {
                this.$Message.error(msg ? msg : '文件上传失败')
              }
            })
          }
        })
      },
      cancel() {
        this.addModal = false;
      }
    },
    computed: {
      ...mapGetters(['accountId', 'roleId'])
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
