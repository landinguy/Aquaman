<template>
  <div ref="AddVue">
    <Modal v-model="addModal" width="640">
      <p slot="header" style="text-align:center">
        <span>添加设备数据</span>
      </p>
      <div>
        <Form ref="form" :model="formData" :rules="formValidate" :label-width="100">
          <FormItem label="设备" prop="deviceId">
            <Select v-model="formData.deviceId">
              <Option v-for="item in devices" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="模拟数据" prop="content">
            <Input v-model.trim="formData.content" placeholder="请填写模拟数据"/>
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
  import {post, get, put} from "@/api/ax"

  export default {
    name: 'AddRecord',
    data() {
      return {
        addModal: false,
        formData: {
          deviceId: '',
          content: ''
        },
        id: '',
        formValidate: {
          deviceId: [{required: true, message: '请选择设备', trigger: 'change'}],
          content: [{required: true, message: '请填写模拟数据', trigger: 'blur'}]
        },
        devices: []
      }
    },
    methods: {
      getDevice() {
        let uid;
        if (this.roleId !== 'ADMIN') uid = this.accountId;

        post(url.getDevice, {uid}).then(res => {
          const {list} = res.data;
          list.forEach(i => this.devices.push({label: i.name, value: i.id.toString()}))
        }).catch(err => console.log(err))
      },
      showModal() {
        this.addModal = true;
      },
      confirm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            post(url.addRecord, this.formData).then(res => {
              this.$Message.success({
                content: '提交成功',
                duration: 1,
                onClose: () => {
                  this.cancel();
                }
              })
            }).catch(err => console.log(err));
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
          this.devices = []
        } else {
          this.getDevice();
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
