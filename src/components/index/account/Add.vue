<template>
  <Form ref="subAccountInfo" :model="subAccountInfo" :rules="ruleValidate" :label-width="120">
    <FormItem label="用户名" prop="subaccountNumber">
      <Input ref="account" v-model="subAccountInfo.subaccountNumber" :disabled="disabled"
             placeholder="4-20个字符，字母或者数组成"></Input>
    </FormItem>
    <FormItem label="用户名称" prop="subaccountNickname">
      <Input v-model="subAccountInfo.subaccountNickname" placeholder="用户名称"></Input>
    </FormItem>
    <FormItem label="用户角色" prop="role">
      <Select v-model="subAccountInfo.role">
        <Option value="1">普通用户</Option>
        <!--<Option value="shanghai">广告审核</Option>-->
        <Option value="2">运营用户</Option>
      </Select>
    </FormItem>

    <!--<FormItem label="业务类型" prop="role">-->
    <!--<Select v-model="subAccountInfo.stype">-->
    <!--<Option value="INTERNAL">内部业务</Option>-->
    <!--<Option value="EXTERNAL">外部业务</Option>-->
    <!--</Select>-->
    <!--</FormItem>-->

    <FormItem label="开通业务" prop="biz">
      <CheckboxGroup v-model="subAccountInfo.biz">
        <Checkbox label="super" v-model="subAccountInfo.superMsg">超信</Checkbox>
        <Checkbox label="simple" v-model="subAccountInfo.simpleMsg">短信</Checkbox>
      </CheckboxGroup>
    </FormItem>

    <!--<FormItem label="使用人：" prop="owner">-->
    <!--<Input v-model="subAccountInfo.owner" placeholder="请填写子账户的使用人，比如xx部门xx人员"></Input>-->
    <!--</FormItem>-->

    <FormItem label="密码" prop="pwd">
      <Input v-model="subAccountInfo.pwd" type="password" placeholder="请输入8-20位密码"></Input>
    </FormItem>
    <FormItem label="确认密码" prop="rePwd">
      <Input v-model="subAccountInfo.rePwd" type="password" placeholder="请重复输入账号密码"></Input>
    </FormItem>
    <FormItem label="上行回调地址" prop="uplinkCallbackUrl">
      <Input v-model="subAccountInfo.uplinkCallbackUrl"/>
    </FormItem>
    <FormItem label="发送状态回调地址" prop="sendCallbackUrl">
      <Input v-model="subAccountInfo.sendCallbackUrl"/>
    </FormItem>
    <FormItem label="签名审核回调地址" prop="signatureCallbackUrl">
      <Input v-model="subAccountInfo.signatureCallbackUrl"/>
    </FormItem>
    <FormItem label="模板审核回调地址" prop="tmplAuditCallbackUrl">
      <Input v-model="subAccountInfo.tmplAuditCallbackUrl"/>
    </FormItem>
    <FormItem label="备注" prop="remark">
      <Input v-model="subAccountInfo.remark" placeholder="请填备注信息，如合同编号，有效期等"></Input>
    </FormItem>
    <FormItem label="cpid" prop="cpid">
      <Input v-model="subAccountInfo.cpid" placeholder=""></Input>
    </FormItem>
    <FormItem label="buid" prop="buid">
      <Input v-model="subAccountInfo.buid" placeholder=""></Input>
    </FormItem>
    <FormItem>
      <Button type="primary" @click="handleSubmit('subAccountInfo')">保存并提交</Button>
      <Button type="ghost" @click="handleReset('subAccountInfo')" style="margin-left: 8px">取消</Button>
    </FormItem>
  </Form>
</template>
<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import VueEvent from '@/libs/vueEvent.js'
  export default {
    computed: {
      ...mapState({
        subAccountList: state => state.subAccount.subAccountList,
      }),
      ...mapGetters(['accountId', 'accountNumber']),
      disabled: function () {
        return this.$parent.index != -1
      }
    },
    data() {
      return {
        subAccountInfo: {
          accountNumber: "",
          subaccountNumber: "",
          subaccountNickname: "",
          role: 1,
          remark: "",
          pwd: "",
          rePwd: "",
          // stype: "",
          cpid: "",
          buid: "",
          superMsg: false,
          simpleMsg: false,
          biz: [],
          uplinkCallbackUrl: "",
          sendCallbackUrl: "",
          tmplAuditCallbackUrl:"",
          signatureCallbackUrl:""
        },

        ruleValidate: {
          subaccountNumber: [
            {required: true, message: '用户名不能为空', trigger: 'blur'}
          ],
          subaccountNickname: [
            {required: true, message: '账号名称不能为空', trigger: 'blur'}
          ],
          pwd: [
            {required: true, message: '密码长度不低于8位且不高于20位', trigger: 'blur'}
          ],
          rePwd: [
            {required: true, message: '密码长度不低于8位且不高于20位', trigger: 'blur'}
          ],
          role: [
            {required: true, message: '角色必选', trigger: 'blur'}
          ],
          biz: [
            {required: true, type: 'array', min: 1, message: '请至少选择一个业务', trigger: 'change'},
            // { type: 'array', max: 2, message: 'Choose two hobbies at best', trigger: 'change' }
          ],
        }
      }
    },
    methods: {
      ...mapActions([
        'handleAddSubAccount',
        'handleModifySubAccount'
      ]),
      handleSubmit(subAccountInfo) {

        this.$refs[subAccountInfo].validate((valid) => {
          if (valid) {
            if (this.$parent.index != -1) {
              var password = "";
              if (this.subAccountInfo.pwd == "000000") {
                password = "";
              }
              else {
                password = this.subAccountInfo.pwd;
              }
              var params = {
                accountNumber: this.accountNumber,
                subaccountNumber: this.subAccountInfo.subaccountNumber,
                subaccountId: this.$parent.modifyInfo.subaccountId,
                subaccountNickname: this.subAccountInfo.subaccountNickname,
                remark: this.subAccountInfo.remark,
                pwd: password,
                roleId: this.subAccountInfo.role,
                // stype: this.subAccountInfo.stype,
                cpid: this.subAccountInfo.cpid,
                buid: this.subAccountInfo.buid,
                superMsg: this.subAccountInfo.superMsg ? 1 : 0,
                simpleMsg: this.subAccountInfo.simpleMsg ? 1 : 0,
                uplinkCallbackUrl: this.subAccountInfo.uplinkCallbackUrl,
                sendCallbackUrl: this.subAccountInfo.sendCallbackUrl,
                tmplAuditCallbackUrl:this.subAccountInfo.tmplAuditCallbackUrl,
                signatureCallbackUrl:this.subAccountInfo.signatureCallbackUrl
              }
              console.log(params);
              this.handleModifySubAccount(params).then(res => {
                console.log(res)
                if (res.code == 0) {
                  this.$Message.info("修改成功");
                  this.$parent.basePage = 0;
                  this.$parent.querySubAccount();
                }
              }, err => {
              });
            }
            else {
              if (this.subAccountInfo.pwd != this.subAccountInfo.rePwd) {
                this.$Message.info("两次输入密码不一致");
                return;
              }
              if (this.subAccountInfo.pwd.length < 8) {
                this.$Message.info("密码长度不低于8位");
                return;
              }
              var data = {
                accountNumber: this.accountNumber,
                subaccountNumber: this.subAccountInfo.subaccountNumber,
                subaccountNickname: this.subAccountInfo.subaccountNickname,
                remark: this.subAccountInfo.remark,
                pwd: this.subAccountInfo.pwd,
                roleId: this.subAccountInfo.role,
                // stype: this.subAccountInfo.stype,
                cpid: this.subAccountInfo.cpid,
                buid: this.subAccountInfo.buid,
                superMsg: this.subAccountInfo.superMsg ? 1 : 0,
                simpleMsg: this.subAccountInfo.simpleMsg ? 1 : 0,
                uplinkCallbackUrl: this.subAccountInfo.uplinkCallbackUrl,
                sendCallbackUrl: this.subAccountInfo.sendCallbackUrl,
                tmplAuditCallbackUrl:this.subAccountInfo.tmplAuditCallbackUrl,
                signatureCallbackUrl:this.subAccountInfo.signatureCallbackUrl
              };
              console.log(data)
              this.handleAddSubAccount(data).then(res => {
                console.log(res)
                if (res.code == 0) {
                  this.$Message.info("添加账号成功");
                  this.$parent.basePage = 0;
                  this.$parent.querySubAccount();
                }
              }, err => {

              });
            }
          } else {
            this.$Message.error('请检查所填信息是否符合要求!');
            return;
          }
        })
      },
      handleReset(name) {
        this.$parent.basePage = 0;
      }
    },
    mounted() {
      const that = this;
      VueEvent.$on('on-open-page',function (name) {
        that.handleReset("");
      });

      console.log("index:" + this.$parent.index)
      if (this.$parent.index != -1) {
        this.subAccountInfo.subaccountNumber = this.$parent.modifyInfo.subaccountNumber;
        this.subAccountInfo.subaccountNickname = this.$parent.modifyInfo.subaccountNickname;
        this.subAccountInfo.remark = this.$parent.modifyInfo.remark;
        this.subAccountInfo.pwd = "000000";
        this.subAccountInfo.rePwd = "000000";
        this.subAccountInfo.role = this.$parent.modifyInfo.roleId;
        // this.subAccountInfo.stype = this.$parent.modifyInfo.stype;
        this.subAccountInfo.buid = this.$parent.modifyInfo.buid;
        this.subAccountInfo.cpid = this.$parent.modifyInfo.cpid;
        this.subAccountInfo.uplinkCallbackUrl = this.$parent.modifyInfo.uplinkCallbackUrl;
        this.subAccountInfo.sendCallbackUrl = this.$parent.modifyInfo.sendCallbackUrl;

        this.subAccountInfo.signatureCallbackUrl = this.$parent.modifyInfo.signatureCallbackUrl;
        this.subAccountInfo.tmplAuditCallbackUrl = this.$parent.modifyInfo.tmplAuditCallbackUrl;

        this.subAccountInfo.superMsg = (this.$parent.modifyInfo.superMsg == 1 ? true : false);
        this.subAccountInfo.simpleMsg = (this.$parent.modifyInfo.simpleMsg == 1 ? true : false);
        if(this.$parent.modifyInfo.superMsg == 1){
          this.subAccountInfo.biz.push('super');
        }
        if(this.$parent.modifyInfo.simpleMsg == 1){
          this.subAccountInfo.biz.push('simple');
        }

      }

    }
  }
</script>

<style scoped>

</style>
