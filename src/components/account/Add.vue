<template>
  <div ref="AddVue">
    <Modal v-model="addModal" width="640">
      <p slot="header" style="text-align:center">
        <span>{{op==='add'?'添加':'编辑'}}用户</span>
      </p>
      <div>
        <Form ref="form" :model="formData" :rules="formValidate" :label-width="100">
          <FormItem label="账号" prop="username">
            <Input v-model.trim="formData.username" placeholder="请填写账号"/>
          </FormItem>
          <FormItem label="密码" prop="password" v-if="op==='add'">
            <Input v-model.trim="formData.password" type="password" placeholder="请填写密码"/>
          </FormItem>
          <FormItem label="姓名" prop="nickname">
            <Input v-model.trim="formData.nickname" placeholder="请填写姓名"/>
          </FormItem>
          <FormItem label="角色" prop="role">
            <Select v-model="formData.role">
              <Option value="ADMIN">管理员</Option>
              <Option value="USER">普通用户</Option>
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
  import {post, get, put} from "@/api/ax"

  export default {
    name: 'Add',
    data() {
      return {
        addModal: false,
        formData: {
          username: '',
          password: '',
          nickname: '',
          role: ''
        },
        id: '',
        formValidate: {
          username: [{required: true, message: '请填写账号', trigger: 'blur'}],
          password: [{required: true, message: '请填写密码', trigger: 'blur'}],
          nickname: [{required: true, message: '请填写姓名', trigger: 'blur'}],
          role: [{required: true, message: '请选择用户角色', trigger: 'change'}],
        },
        op: 'add'
      }
    },
    methods: {
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
            post(url.addAccount, param).then(res => {
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
          const {username, nickname, id, role} = data;
          this.id = id;
          this.formData.username = username;
          this.formData.nickname = nickname;
          this.formData.role = role;
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
