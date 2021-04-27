<template>
  <div class="bg">
    <div class="welcome-div">
      <span class="text">{{username}}，您好！  欢迎使用Demo ~</span>
    </div>

    <div class="user-info">
      <h3>用户信息</h3>
      <p>账号： {{username}}</p>
      <p>手机号： {{phone}}</p>

      <div v-if="isCustomer">
        <p>所属农业合作社： {{user.agriculturalCooperative}}</p>
        <p>详细地址： {{user.address}}</p>
      </div>
      <div v-if="isWorker">
        <p>工号： {{user.workNumber}}</p>
        <Button type="primary" size="small" shape="circle" class="radio_len ; register-btn" @click="showAddWorkRecordModal">上工登记</Button>
      </div>
    </div>

    <div class="fulfill" v-if="showFulfillDiv">
      <h3>您需要完善以下用户信息</h3>
      <div class="fulfill-form">
        <Form ref="form" :model="formData" :rules="formValidate" :label-width="120">
          <FormItem label="所属农业合作社" prop="agriculturalCooperative">
            <Input v-model.trim="formData.agriculturalCooperative" placeholder="请填写所属农业合作社"/>
          </FormItem>
          <FormItem label="详细地址" prop="address">
            <Input v-model.trim="formData.address" placeholder="请填写详细地址"/>
          </FormItem>
        </Form>
        <Button type="primary" size="small" shape="circle" class="radio_len" @click="saveUserInfo">提交</Button>
      </div>
    </div>

    <AddWorkRecord ref="AddWorkRecordVue"/>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'
  import {ROLE} from '@/libs/constant'
  import userApi from '@/api/user'
  import AddWorkRecord from "./AddWorkRecord";

  export default {
    name: 'Home',
    data() {
      return {
        formData: {
          agriculturalCooperative: '',
          address: '',
        },
        formValidate: {
          agriculturalCooperative: [{required: true, message: '请填写所属农业合作社', trigger: 'blur'}],
          address: [{required: true, message: '请填写详细地址', trigger: 'blur'}],
        },
        user: {
          id: 0,
          username: '',
          phoneNumber: '',
          agriculturalCooperative: '',
          address: '',
          workNumber: ''
        },
        needFulfillInfo: true
      }
    },
    components: {AddWorkRecord},
    methods: {
      showAddWorkRecordModal() {
        this.$refs.AddWorkRecordVue.showModal(this.user);
      },
      saveUserInfo() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            let params = this.formData;
            const {id, username, phoneNumber} = this.user;
            userApi.saveUser({...params, id, username, phoneNumber}).then(res => {
              this.$Message.success({
                content: '提交成功',
                duration: 1,
                onClose: () => {
                  this.needFulfillInfo = false;
                  this.user.agriculturalCooperative = this.formData.agriculturalCooperative;
                  this.user.address = this.formData.address
                }
              })
            }).catch(err => console.log(err));
          }
        })
      },
    },
    mounted() {
      userApi.getById(this.accountId).then(res => {
        const {data} = res;
        if (data) {
          Object.assign(this.user, data);
          const {address, agriculturalCooperative} = data;
          if (address !== '' && agriculturalCooperative !== '') {
            this.needFulfillInfo = false
          }
        }
      });
    },
    computed: {
      ...mapGetters(['accountId', 'role', 'username', 'phone', 'email']),
      isCustomer() {
        return this.role === ROLE.customer
      },
      isWorker() {
        return this.role === ROLE.buyer || this.role === ROLE.warehouseman || this.role === ROLE.salesman
      },
      showFulfillDiv() {
        return this.isCustomer && this.needFulfillInfo
      }
    }
  }
</script>
<style scoped lang="less">
  .bg {
    background-color: white;
    width: 100%;
    height: 100%;
    padding: 32px;
  }

  .welcome-div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;

    .text {
      letter-spacing: 2px;
      font-size: 16px;
      font-style: italic;
      font-weight: bold;
    }
  }

  .user-info {
    margin-top: 32px;

    h3, p {
      margin-bottom: 8px
    }

    .register-btn {
      margin-top: 16px;
    }
  }

  .fulfill {
    margin-top: 32px;
    width: 640px;

    &-form {
      margin-top: 16px;
    }
  }
</style>
