<template>
  <Form ref="group" :model="group"  :rules="ruleValidate" :label-width="120">
    <FormItem label="运营账户"  prop="accountId">
      <Select v-model="group.accountId" @on-change="selectChange()">
        <Option v-for="item in operating" :value="item.subaccountId"  :key="item.subaccountId">{{item.subaccountNickname}}</Option>
      </Select>
    </FormItem>

    <FormItem label="分组名称" prop="groupName">
      <Input v-model="group.groupName" placeholder="用户名称"></Input>
    </FormItem>


    <FormItem label="关联用户"  prop="members">
      <CheckboxGroup v-model="group.members">
        <Checkbox v-for="item in ordinary" :label="item.subaccountNumber" :key="item.subaccountId"></Checkbox>
      </CheckboxGroup>
    </FormItem>
    <FormItem>
      <Button type="primary" @click="handleSubmit()">保存并提交</Button>
      <Button type="ghost" @click="handleReset()" style="margin-left: 8px">取消</Button>
    </FormItem>
  </Form>
</template>

<script>
    import { mapActions,mapState,mapGetters } from 'vuex'
    import VueEvent from '@/libs/vueEvent.js'
    export default {
        name: "Group",
      mounted(){
        const that = this;
        VueEvent.$on('on-open-page',function (name) {
          that.handleReset();
        });
      },
      data(){
          return{
            group:{
              accountId:"",
              groupName:"",
              members:[]
            },
            ruleValidate: {
              accountId: [
                {required: true, message: '运营账户不能为空', trigger: 'blur'}
              ],
              groupName: [
                {required: true, message: '分組名称不能为空', trigger: 'blur'}
              ],
            }
          }
      },

      methods:{
        ...mapActions([
          'handleAddGroup',
          'handleQueryRelate'
        ]),
        handleSubmit(){

          var params = {accountId:this.group.accountId, groupName:this.group.groupName, members:this.getAccountIds(this.group.members)}

          this.$refs.group.validate((valid) => {
            if (valid) {
              this.$parent.basePage = 0;
              this.handleAddGroup(params).then(res=>{
                  if(res.code == 0){

                  }
                  else
                  {
                    this.$Message.info(res.msg);
                  }
                }, err=>{

                }
              )
            }
            else
            {

            }
          })


        },
        handleReset(){
          this.$parent.basePage = 0;
        },

        getAccountIds(members){
          var data = [];
          for(var i = 0; i < members.length; i++){
            for(var j = 0; j < this.subAccountList.length; j++){
              if(this.subAccountList[j].subaccountNumber == members[i]){
                console.log(this.subAccountList[j].subaccountNumber, this.subAccountList[j].subaccountId);
                data.push(this.subAccountList[j].subaccountId);
                break;
              }
            }
          }
          return data;
        },
        selectChange(){
          this.group.members.length = 0;
          this.handleQueryRelate({accountId:this.group.accountId}).then(res=>{
            if(res.code == 0){
              for(var i=0; i<res.data.length; i++){
                this.group.members.push(res.data[i].subaccountNumber);
              }
            }else
            {
              this.$Message.info(res.msg);
            }
          })
        }
      },
      computed: {
        ...mapState({
          subAccountList:state => state.subAccount.subAccountList,
          ordAccountList:state => state.subAccount.ordAccountList,
        }),
        ...mapGetters(['accountId','accountNumber']),

        ordinary(){
          var data = [];
            for (var i = 0; i < this.subAccountList.length; i++) {
              if (this.subAccountList[i].roleId == '1') {
                data.push(this.subAccountList[i]);
              }
            }
          return data;
        },
        operating(){
          var data = [];
          for (var i = 0; i < this.subAccountList.length; i++) {
            if (this.subAccountList[i].roleId == '2') {
              data.push(this.subAccountList[i]);
            }
          }
          return data;
        }
      },
    }
</script>

<style scoped>

</style>
