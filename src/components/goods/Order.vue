<template>
  <div ref="OrderVue">
    <Modal v-model="addModal" width="960">
      <p slot="header" style="text-align:center">
        <span>购物车</span>
      </p>
      <div>
        <template v-for="it in goods">
          <div class="item">
            <img :src="it.image">
            <h5>{{it.name}}</h5>
            <span>￥{{it.price}}</span>
            <a @click="deleteGoods(it.id)">删除</a>
          </div>
        </template>

        <Form ref="form" :model="formData" :rules="formValidate" :label-width="80" v-show="step===2"
              style="margin-top: 32px">
          <FormItem label="收货地址" prop="address">
            <Input v-model.trim="formData.address" placeholder="请填写收货地址"/>
          </FormItem>
        </Form>
      </div>
      <div slot="footer" style="text-align: center">
        <span style="margin-right: 32px">合计：￥<b>{{price}}</b></span>
        <Button type="error" shape="circle" class="radio_len" size="small" @click="submit" v-if="step===1">去结算</Button>
        <Button type="error" shape="circle" class="radio_len" size="small" @click="pay" v-if="step===2">提交订单</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import url from '@/api/url'
  import {post} from "../../api/ax";

  export default {
    name: 'Order',
    data() {
      return {
        addModal: false,
        goods: [],
        step: 1,
        formData: {
          address: ''
        },
        formValidate: {
          address: [{required: true, message: '请填写收货地址', trigger: 'blur'}],
        },
      }
    },
    methods: {
      deleteGoods(id) {
        for (let [index, it] of this.goods.entries()) {
          if (it.id === id) {
            this.goods.splice(index, 1);
            this.$parent.onSelectGoods(id, false);
            return
          }
        }
      },
      showModal(data) {
        this.addModal = true;
        if (data) this.goods = data;
      },
      submit() {
        if (this.goods.length === 0) {
          this.$Message.warning('您还没有选购商品，无需结算');
          return;
        }
        this.step = 2;
      },
      pay() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            let goodsId = this.goods.map(it => it.id).join(",");
            let price = this.price;
            const {address} = this.formData;
            post(url.addOrder, {goodsId, price, address}).then(res => {
              const {code, msg} = res;
              if (code === 0) {
                this.$Message.success({
                  content: '提交成功',
                  duration: 1,
                  onClose: () => {
                    this.cancel();
                    this.$parent.clearGoods();
                    // this.$parent.search();
                  }
                })
              } else {
                this.$Message.error(`订单提交失败,${msg}`)
              }
            }).catch(err => console.log(err));
          }
        })
      },
      cancel() {
        this.addModal = false;
      }
    },
    computed: {
      price() {
        return this.goods.map(it => it.price).reduce((a, b) => a + b, 0)
      }
    },
    watch: {
      addModal(curVal, oldVal) {
        if (!curVal) {
          this.step = 1;
        }
      }
    }
  }
</script>
<style lang="less">
  .item {
    margin-bottom: 8px;
    padding: 5px;
    border: 1px solid #eee;
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    img {
      width: 80px;
      height: 80px;
    }

    a {
      color: red;
    }
  }
</style>
