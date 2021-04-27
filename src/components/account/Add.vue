<template>
  <div ref="AddVue">
    <Modal v-model="addModal" width="640">
      <p slot="header" style="text-align:center">
        <span>{{op==='add'?'添加':'编辑'}}工作人员</span>
      </p>
      <div>
        <Form ref="form" :model="formData" :rules="formValidate" :label-width="80">
          <FormItem label="用户名" prop="username">
            <Input v-model.trim="formData.username" placeholder="请填写用户名"/>
          </FormItem>
          <FormItem label="密码" prop="password" v-if="op==='add'">
            <Input v-model.trim="formData.password" type="password" placeholder="请填写密码"/>
          </FormItem>
          <FormItem label="确认密码" prop="confirmPwd" v-if="op==='add'">
            <Input v-model.trim="formData.confirmPwd" type="password" placeholder="请确认密码"/>
          </FormItem>
          <FormItem label="角色" prop="role">
            <Select v-model="formData.role">
              <Option :value="ROLE.buyer">采购</Option>
              <Option :value="ROLE.warehouseman">仓储</Option>
              <Option :value="ROLE.salesman">销售</Option>
            </Select>
          </FormItem>
          <FormItem label="工号" prop="workNumber">
            <Input v-model.trim="formData.workNumber" placeholder="请填写工号"/>
          </FormItem>
          <!--          <FormItem label="邮箱" prop="email">-->
          <!--            <Input v-model.trim="formData.email" placeholder="请填写邮箱"/>-->
          <!--          </FormItem>-->
          <FormItem label="手机号" prop="phoneNumber">
            <Input v-model.trim="formData.phoneNumber" placeholder="请填写手机号"/>
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
  import userApi from '@/api/user'
  import {ROLE} from "@/libs/constant";

  export default {
    name: 'Add',
    data() {
      return {
        addModal: false,
        formData: {
          username: '',
          password: '',
          confirmPwd: '',
          role: '',
          phoneNumber: '',
          workNumber: '',
          // email: '',
        },
        id: '',
        formValidate: {
          username: [{required: true, message: '请填写用户名', trigger: 'blur'}],
          password: [{required: true, message: '请填写密码', trigger: 'blur'}],
          confirmPwd: [{required: true, message: '请再次输入密码', trigger: 'blur'}],
          role: [{required: true, message: '请选择用户角色', trigger: 'change'}],
          workNumber: [{required: true, message: '请填写工号', trigger: 'blur'}],
          phoneNumber: [
            {required: true, message: '请填写手机号', trigger: 'blur'},
            {validator: this.validatePhone, trigger: 'blur'}
          ],
          // email: [
          //   {required: true, message: '请填写邮箱', trigger: 'blur'},
          //   {type: 'email', message: '邮箱格式不正确', trigger: 'blur'}
          // ]
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
            const {password, confirmPwd} = this.formData;
            if (password !== confirmPwd) {
              this.$Message.warning('两次输入密码不一致')
              return
            }
            let param = this.formData;
            param.id = this.id;
            userApi.saveUser(param).then(res => {
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
          const {username, id, role, phoneNumber, workNumber} = data;
          this.id = id;
          this.formData.username = username;
          this.formData.role = role;
          this.formData.workNumber = workNumber;
          this.formData.phoneNumber = phoneNumber;
        }
      }
    },
    computed: {
      ROLE() {
        return ROLE
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
