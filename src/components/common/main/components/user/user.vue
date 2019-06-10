<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <!--<Button type="default">-->
      <Button type="default" ghost style="background: none;border:none;color: white;font-size: 14px">
        <!--<icon :size="18" type="person"></icon>-->
        <!--&nbsp;{{accountNickname}}&nbsp;-->
        <!--<Icon :size="12" type="arrow-down-b"></Icon>-->
        <div style="line-height:18px;height: 18px">
          <img :src="user_icon" style="height: 18px; float: left"/>
          <div style=" float: left">{{accountNickname}}</div>
          <Icon :size="16" type="arrow-down-b"></Icon>
        </div>
      </Button>
      <DropdownMenu slot="list">
        <DropdownItem name="password">修改密码</DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <Modal v-model="addModal" width="640">
      <p slot="header" style="text-align:center">
        <span>修改密码</span>
      </p>
      <div>
        <Form ref="form" :model="formData" :rules="formValidate" :label-width="100" width="540px">
          <FormItem label="旧密码" prop="oldPassword">
            <Input v-model.trim="formData.oldPassword" type="password" placeholder="请输入旧密码"/>
          </FormItem>
          <FormItem label="新密码" prop="newPassword">
            <Input v-model.trim="formData.newPassword" type="password" placeholder="请输入新密码"/>
          </FormItem>
          <FormItem label="确认密码" prop="confirmPwd">
            <Input v-model.trim="formData.confirmPwd" type="password" placeholder="请确认新密码"/>
          </FormItem>
        </Form>
      </div>
      <div slot="footer" style="text-align: center">
        <Button type="primary" shape="circle" class="radio_len" @click="confirm">提交</Button>
        <Button type="default" shape="circle" class="radio_len" style="margin-left: 20px" @click="cancel">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import './user.less'
  import {mapActions, mapGetters} from 'vuex'
  import user_icon from '@/assets/images/user.png'
  import {post, get, $get, put} from "@/api/ax"
  import url from '@/api/url'

  export default {
    name: 'User',
    data() {
      return {
        user_icon,
        addModal: false,
        formData: {oldPassword: "", newPassword: "", confirmPwd: ""},
        formValidate: {
          oldPassword: [{required: true, message: '请输入旧密码', trigger: 'blur'}],
          newPassword: [{required: true, message: '请输入新密码', trigger: 'blur'}],
          confirmPwd: [{required: true, message: '请确认新密码', trigger: 'blur'}]
        },
      }
    },
    methods: {
      ...mapActions(['handleLogOut']),
      handleClick(name) {
        switch (name) {
          case 'logout':
            let token = 'Bearer ' + this.accessToken;
            this.handleLogOut({token}).then(res => {
              if (res.status == 200) this.$router.push({name: 'login'});
            }).catch(err => console.log(err));
            break;
          case 'password':
            this.addModal = true;
            break;
        }
      },
      cancel() {
        this.addModal = false;
      },
      confirm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            const {oldPassword, newPassword, confirmPwd} = this.formData;
            if (newPassword !== confirmPwd) {
              this.$Message.warning('确认密码与新密码不一致');
              return
            }
            put(url.resetPassword, {oldPassword, newPassword}).then(res => {
              if (res.ret_code == 0) {
                this.$Message.success('修改成功');
                this.cancel();
              } else {
                this.$Message.error(`修改失败 [${res.error_msg}]`);
              }
            }).catch(err => console.log(err))
          }
        })
      },
    },
    computed: {
      ...mapGetters(['accountNumber', 'accountId', 'accountNickname', 'accessToken'])
    },
    watch: {
      addModal(curVal, oldVal) {
        if (!curVal) this.$refs.form.resetFields()
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
