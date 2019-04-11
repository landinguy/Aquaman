<template>
  <div ref="AddVue">
    <Modal v-model="addModal" width="640">
      <p slot="header" style="text-align:center">
        <span>删除设备</span>
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
  import {post, get, put, $get} from "@/api/ax"

  export default {
    name: 'Delete',
    data() {
      return {
        addModal: false,
        formData: {
          name: '',
        },
        formValidate: {
          name: [{required: true, message: '请填写设备key', trigger: 'blur'}],
        },
        deviceKey: '',
        id: ''
      }
    },
    methods: {
      showModal(id, deviceKey) {
        this.id = id
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
            let id = this.id
            this.$Modal.confirm({
              title: '删除',
              content: '确认删除该设备？',
              onOk: () => {
                $get(url.deleteDevice, {id}).then(res => {
                  if (res.code == 0) {
                    this.$Message.success({
                      content: '已删除',
                      duration: 1,
                      onClose: () => {
                        this.$parent.search()
                      }
                    });
                  } else {
                    this.$Message.error('删除失败');
                  }
                });
              }
            });
          }
        })
      }
    },
    watch: {
      addModal(curVal, oldVal) {
        if (!curVal) {
          this.$refs.form.resetFields()
          this.deviceKey = ''
          this.id = ''
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
