<template>
  <div ref="AddVue">
    <Modal v-model="addModal" width="640">
      <p slot="header" style="text-align:center">
        <span>设备key确认</span>
      </p>
      <div>
        <Form ref="form" :model="formData" :rules="formValidate" :label-width="80">
          <FormItem label="设备key" prop="name">
            <Input v-model.trim="formData.name" placeholder="请填写设备key"/>
          </FormItem>
        </Form>
      </div>
      <div slot="footer" style="text-align: center">
        <Button type="primary" shape="circle" class="radio_len" @click="confirm">确认</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import url from '@/api/url'
  import {post, get, put} from "@/api/ax"

  export default {
    name: 'DeviceKey',
    data() {
      return {
        addModal: false,
        formData: {
          name: '',
        },
        formValidate: {
          name: [{required: true, message: '请填写设备key', trigger: 'blur'}],
        },
        deviceKey: ''
      }
    },
    methods: {
      showModal(deviceKey) {
        this.deviceKey = deviceKey
        this.addModal = true
      },
      confirm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            if (this.deviceKey !== this.formData.name) {
              this.$Message.warning('设备key错误')
              return
            }
            this.addModal = false
            this.$parent.addModal = true
          }
        })
      }
    },
    watch: {
      addModal(curVal, oldVal) {
        if (!curVal) {
          this.$refs.form.resetFields()
          this.deviceKey = ''
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
