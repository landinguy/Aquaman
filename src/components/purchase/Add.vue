<template>
  <div ref="AddVue">
    <Modal v-model="addModal" width="640">
      <p slot="header" style="text-align:center">
        <span>采购信息登记</span>
      </p>
      <div>
        <Form ref="form" :model="formData" :rules="formValidate" :label-width="80">
          <FormItem label="商品名" prop="goodsName">
            <Input v-model.trim="formData.goodsName" placeholder="请填写商品名"/>
          </FormItem>
          <FormItem label="商品类别" prop="goodsType">
            <Select v-model="formData.goodsType">
              <Option v-for="item in goodsTypeData" :key="item.id" :value="item.name">{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="采购数量" prop="purchaseNumber">
            <Input v-model.trim="formData.purchaseNumber" placeholder="采购数量" :number="true"/>
          </FormItem>
          <FormItem label="生产日期" prop="ProductionDate">
            <Input v-model.trim="formData.ProductionDate" placeholder="生产日期" type="date"/>
          </FormItem>
          <FormItem label="采购日期" prop="purchaseDate">
            <Input v-model.trim="formData.purchaseDate" placeholder="采购日期" type="date"/>
          </FormItem>
          <FormItem label="厂家地址" prop="manufacturerAddress">
            <Input v-model.trim="formData.manufacturerAddress" placeholder="请填写厂家地址"/>
          </FormItem>
          <FormItem label="厂家联系方式" prop="manufacturerPhone">
            <Input v-model.trim="formData.manufacturerPhone" placeholder="请填写厂家联系方式"/>
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
  import {ROLE} from "@/libs/constant"
  import {validatePhone} from '@/libs/util'

  export default {
    name: 'Add',
    props: {
      goodsTypeData: Array
    },
    data() {
      return {
        addModal: false,
        formData: {
          goodsName: '',
          goodsType: '',
          purchaseNumber: '',
          ProductionDate: '',
          purchaseDate: '',
          manufacturerAddress: '',
          manufacturerPhone: '',
        },
        id: '',
        formValidate: {
          goodsName: [{required: true, message: '请填写商品名', trigger: 'blur'}],
          goodsType: [{required: true, message: '请填写商品类别', trigger: 'change'}],
          purchaseNumber: [{required: true, message: '请填写采购数量', trigger: 'blur'}],
          ProductionDate: [{required: true, message: '请填写生产日期', trigger: 'blur'}],
          purchaseDate: [{required: true, message: '请填写采购日期', trigger: 'blur'}],
          manufacturerAddress: [{required: true, message: '请填写厂家地址', trigger: 'blur'}],
          manufacturerPhone: [
            {required: true, message: '请填写厂家联系方式', trigger: 'blur'},
            {validator: validatePhone, trigger: 'blur'}
          ],
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
            console.log("----->", JSON.stringify(param))
            // param.id = this.id;
            // userApi.saveUser(param).then(res => {
            //   this.$Message.success({
            //     content: '提交成功',
            //     duration: 1,
            //     onClose: () => {
            //       this.cancel();
            //       this.$parent.search();
            //     }
            //   })
            // }).catch(err => console.log(err));
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
