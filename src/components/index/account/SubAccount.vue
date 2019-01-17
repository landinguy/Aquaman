<template>
    <div class="bg">
      <div v-if="basePage==1" class="sub">
        <p>{{title}}</p>
        <Add :index="index"></Add>
      </div>
      <div v-if="basePage==2" class="sub">
        <p>{{groupTitle}}</p>
        <Group></Group>
      </div>
      <div v-if="basePage==0" class="sub">
        <div  class="query">
          <div class="sel">
            <label>用户名称</label>
            <Input v-model="accountNickName" placeholder="用户名称" style="width: 160px;margin-right: 32px;"></Input>
          </div>
          <div class="sel">
            <label>用户状态</label>
            <Select v-model="accountState" style="width:160px;margin-right: 32px;">
              <Option v-for="item in selectedState" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
          <div class="sel">
            <Button type="primary" @click="querySubAccount()" >查询</Button>
          </div>
          <div style="clear: left"></div>
        </div>
        <div style="padding-left: 16px;padding-right: 16px;">
          <Button type="primary" style="margin-top: 16px;margin-bottom: 16px;" @click="addSubAccount()">添加用户</Button>
          <Button type="primary" style="margin-top: 16px;margin-bottom: 16px;" @click="addGroupUI()">添加分組</Button>
          <Button type="primary" style="margin-top: 16px;margin-bottom: 16px;" @click="modifyGroupUI()">修改分組</Button>
          <!--<Button type="primary" style="margin-top: 16px;margin-bottom: 16px;" @click="addSubAccount()">+添加用户组</Button>-->
          <Table border :columns="columns" :data="subAccountList"></Table>
        </div>
      </div>
    </div>
</template>
<script>
  import Add from "./Add"
  import Group from "./Group"
  import { mapActions,mapState,mapGetters } from 'vuex'
    export default {
    created(){
      // this.querySubAccount();
    },
    components:{
        Add,
        Group
      },
      methods:{
        ...mapActions([
          'handleQuerySubAccountList',
          'handleDisableOrDeleteSubAccount'
        ]),

        instance (type, content,index, action) {
          const self = this;
          switch (type) {
            case 'warning':
              this.$Modal.warning({
                content: content,
                closable:true,
                onOk:function () {
                  self.disableOrDeleteSubAccount(index, action);
                }
              });
              break;
            case 'error':
              this.$Modal.error({
                content: content,
                closable:true,
                onOk:function () {
                  self.disableOrDeleteSubAccount(index, action);
                }
              });
              break;
          }
        },

        addGroupUI(){
          console.log("添加关联分组:"+ this.basePage)
          this.basePage = 2;
          this.groupTitle="添加分组";
          this.groupOperate = 0;
        },

        modifyGroupUI(){
          console.log("添加关联分组:"+ this.basePage)
          this.basePage = 2;
          this.groupTitle="修改分组";
          this.groupOperate = 1;
        },

        addSubAccount(){
          this.basePage = 1;
          this.index = -1;
          this.title = "添加用户";
        },
        modifySubAccount(index){

          this.index = index;
          this.modifyInfo = this.subAccountList[index];
          this.basePage = 1;
          this.title = "修改用户";
        },
        querySubAccount(){
          var data = {subaccountNickname:this.accountNickName,status:this.accountState}
          console.log(data)
          this.handleQuerySubAccountList(data);
        },
        disableOrDeleteSubAccount(index, status){
          var data = {subaccountId:this.subAccountList[index].subaccountId, status:status}
          console.log(data)

          this.handleDisableOrDeleteSubAccount(data).then(res=>{
              if(res.code == 0){
                this.$Message.info("账号已禁用或者删除");
                this.querySubAccount();
              }
          },err=>{

          });
        }
      },
      computed: {
        ...mapState({
          subAccountList:state => state.subAccount.subAccountList,
        }),
        ...mapGetters(['accountId','accountNumber']),
      },
      data(){
        return{
          show:true,
          index:-1,
          modifyInfo:null,
          accountNickName:"",
          // accountNumber:"",
          accountState:"",
          addAccount:false,
          addGroup:false,
          basePage:0,
          title:"新建子账户",
          groupTitle:"添加分组",
          groupOperate:-1,
          selectedState: [
            {
              value: '',
              label: '全部'
            },
            {
              value: 'USE',
              label: '使用中'
            },
            {
              value: 'DISABLED',
              label: '禁用'
            },
          ],
          columns:[
            {title:"用户Id",key:"subaccountId","width": 210,"align":"center"},
            {title:"用户名（登录名）",key:"subaccountNumber","width": 160,"align":"center"},
            {title:"用户名称",key:"subaccountNickname","width": 200,"align":"center"},
            {title:"用户角色",key:"roleName","width": 100,"align":"center"},
            {title:"创建时间",key:"createTs","width": 200,"align":"center"},
            {title:"用户状态",key:"statusName","width": 100,"align":"center"},
            {title:"超信累计充值",key:"chargeAmount","width": 160,"align":"center"},
            {title:"短信累计充值",key:"simpleChargeAmount","width": 160,"align":"center"},
            {title:"超信可用余量",key:"remainder","width": 160,"align":"center"},
            {title:"短信可用余量",key:"simpleRemainder","width": 160,"align":"center"},
            {title:"操作",key:"action",
              width: 200,
              align: 'center',
              render: (h, params) => {
                var text = "禁用";
                var type = "default";
                var tip = "您确定要禁用该账户吗？";
                var operate = "DISABLED";
                if(this.subAccountList[params.index].status == 'DISABLED'){
                  text = "解禁";
                  type = "info";
                  tip = "您确定要解禁该账户吗？"
                  operate = "USE";
                }
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.modifySubAccount(params.index)
                      }
                    }
                  }, '修改'),
                  h('Button', {
                    props: {
                      type: type,
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.instance("warning", tip, params.index,operate)
                      }
                    }
                  }, text),
                  h('Button', {
                    props: {
                      type: 'error',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.instance("error", "您确定要删除该账户吗？",params.index, "DELETED")
                      }
                    }
                  }, '删除'),
                ]);
              }
            },
            ],
        }
      }
    }
</script>

<style scoped>
  .bg{
    background-color: white;
    width: 100%;
  }
  .sub{
    width: 100%;
    padding: 16px;

  }
  /*.query{*/
    /*padding: 16px 16px 16px 0px;*/
    /*border-bottom: 1px solid darkgray;*/
  /*}*/

  label{
    margin-right: 8px;
    font-weight: bold;
  }

  p{
    font-weight: bold;
    font-size: 16px;
    padding-bottom:32px;
  }

  .sel{
    margin-top: 4px;
    padding-bottom: 4px;
    /*margin-left: 16px;*/
    float: left;
  }
  .query{
    width: 100%;
    background-color: white;
    padding: 0px 16px 16px 16px;
  }
</style>
