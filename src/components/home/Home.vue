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
        <p>所属农业合作社： {{customer.agriculturalCooperative}}</p>
        <p>详细地址： {{customer.address}}</p>
      </div>
    </div>

    <div class="fulfill" v-if="showFulfillDiv">
      <h3>您需要完善以下用户信息</h3>
      <div class="fulfill-form">
        <Form ref="form" :model="formData" :rules="formValidate" :label-width="120">
          <FormItem label="所属农业合作社" prop="agricultural_cooperative">
            <Input v-model.trim="formData.agricultural_cooperative" placeholder="请填写所属农业合作社"/>
          </FormItem>
          <FormItem label="详细地址" prop="address">
            <Input v-model.trim="formData.address" placeholder="请填写详细地址"/>
          </FormItem>
        </Form>
        <Button type="primary" size="small" shape="circle" class="radio_len" @click="saveCustomerInfo">提交</Button>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'
  import {ROLE_ENUM} from '@/libs/constant'
  import customerApi from '@/api/customer'

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
        customer: {
          agriculturalCooperative: '',
          address: '',
          needFulfillInfo: true
        }
      }
    },
    components: {},
    methods: {
      saveCustomerInfo() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            customerApi.save(this.formData).then(res => {
              this.$Message.success({
                content: '提交成功',
                duration: 1,
                onClose: () => {
                  this.customer.needFulfillInfo = false;
                  this.customer.agriculturalCooperative = this.formData.agriculturalCooperative
                  this.customer.address = this.formData.address
                }
              })
            }).catch(err => console.log(err));
          }
        })
      },
    },
    mounted() {
      if (this.isCustomer) {
        customerApi.queryById(this.accountId).then(res => {
          const {data} = res;
          if (data) {
            const {address, agriculturalCooperative} = data;
            this.customer.address = address;
            this.customer.agriculturalCooperative = agriculturalCooperative;
            this.customer.needFulfillInfo = false
          }
        });
      }
    },
    computed: {
      ...mapGetters(['accountId', 'role', 'username', 'phone', 'email']),
      isCustomer() {
        return this.role === ROLE_ENUM.customer
      },
      showFulfillDiv() {
        return this.isCustomer && this.customer.needFulfillInfo
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

  .radio_len {
    width: 80px;
    text-align: center;
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
  }

  .fulfill {
    margin-top: 32px;
    width: 640px;

    &-form {
      margin-top: 16px;
    }
  }
</style>
