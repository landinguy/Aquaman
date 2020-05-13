<template>
  <div ref="ShareVue">
    <Modal v-model="addModal" width="640">
      <p slot="header" style="text-align:center">
        <span>共享文件</span>
      </p>
      <div>
        <Form ref="form" :model="formData" :rules="formValidate" :label-width="60">
          <FormItem label="账号id" prop="uid">
            <Input v-model.trim="formData.uid" placeholder="请填写共享账号id"/>
          </FormItem>
        </Form>
      </div>
      <div slot="footer" style="text-align: center">
        <Button type="primary" shape="circle" class="radio_len" style="margin-left: 20px" @click="submit">提交</Button>
        <Button type="ghost" shape="circle" class="radio_len" style="margin-left: 20px" @click="cancel">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import url from '@/api/url'
  import {post} from "@/api/ax"

  export default {
    name: 'Share',
    data() {
      return {
        addModal: false,
        formData: {
          fid: null,
          uid: ''
        },
        formValidate: {
          uid: [{required: true, message: '请填写共享账号id', trigger: 'blur'}]
        },
      }
    },
    methods: {
      showModal(fid) {
        this.formData.fid = fid;
        this.addModal = true;
      },
      submit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            post(url.share, this.formData).then(res => {
              const {code, msg} = res;
              if (code === 0) {
                this.$Message.success({
                  content: '提交成功',
                  duration: 1,
                  onClose: () => this.cancel()
                })
              } else {
                this.$Message.error(msg)
              }
            }).catch(err => console.log(err))
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
