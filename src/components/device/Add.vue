<template>
  <div ref="AddVue">
    <Modal v-model="addModal" width="640">
      <p slot="header" style="text-align:center">
        <span>{{op==='add'?'添加':'编辑'}}设备</span>
      </p>
      <div>
        <Form ref="form" :model="formData" :rules="formValidate" :label-width="80">
          <FormItem label="设备名" prop="name">
            <Input v-model.trim="formData.name" placeholder="请填写设备名"/>
          </FormItem>
          <FormItem label="设备类型" prop="type">
            <Select v-model="formData.type">
              <Option value="1">温度</Option>
              <Option value="2">湿度</Option>
            </Select>
          </FormItem>
          <FormItem label="所属用户" prop="uid">
            <Select v-model="formData.uid">
              <Option v-for="item in users" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="设备描述" prop="description">
            <Input v-model.trim="formData.description" type="textarea" :rows="4" placeholder="请填写设备描述"/>
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
  import {post, get, put} from "@/api/ax"

  export default {
    name: 'Add',
    data() {
      return {
        addModal: false,
        formData: {
          name: '',
          type: '',
          uid: '',
          description: ''
        },
        id: '',
        formValidate: {
          name: [{required: true, message: '请填写账号', trigger: 'blur'}],
          description: [{required: true, message: '请填写设备描述', trigger: 'blur'}],
          type: [{required: true, message: '请选择设备类型', trigger: 'change'}],
          uid: [{required: true, message: '请选择所属用户', trigger: 'change'}],
        },
        op: 'add',
        users: []
      }
    },
    methods: {
      getAccount() {
        post(url.getAccount, {}).then(res => {
          const {list} = res.data;
          list.forEach(i => this.users.push({label: i.nickname, value: i.id.toString()}))
        }).catch(err => console.log(err))
      },
      showModal(data) {
        if (data) {
          this.op = 'edit';
          this.setData(data);
        }
        this.addModal = true;
      },
      confirm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            let param = this.formData;
            param.id = this.id;
            post(url.addDevice, param).then(res => {
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
          const {name, type, description, id, uid} = data;
          this.id = id;
          this.formData.name = name;
          this.formData.type = type.toString();
          this.formData.description = description;
          this.formData.uid = uid.toString();
        }
      }
    },
    watch: {
      addModal(curVal, oldVal) {
        if (!curVal) {
          this.$refs.form.resetFields()
          this.op = 'add';
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
