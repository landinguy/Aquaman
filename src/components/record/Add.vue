<template>
  <div ref="AddVue">
    <Modal v-model="addModal" width="640">
      <p slot="header" style="text-align:center">
        <span>{{op==='add'?'添加':'编辑'}}违章记录</span>
      </p>
      <div>
        <Form ref="form" :model="formData" :rules="formValidate" :label-width="100">
          <FormItem label="车主" prop="uid">
            <Select v-model="formData.uid" @on-change="onUIdChange">
              <Option v-for="item in users" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="车牌号" prop="plateNumber">
            <Select v-model="formData.plateNumber">
              <Option v-for="item in plateData" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="违章原因" prop="reason">
            <Input v-model.trim="formData.reason" type="textarea" :rows="4" placeholder="请填写违章原因"/>
          </FormItem>
          <FormItem label="罚款金额" prop="fine">
            <Input v-model.trim="formData.fine" placeholder="请填写罚款金额"/>
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
          name: '',
          plateNumber: '',
          uid: '',
          reason: '',
          fine: '',
        },
        id: '',
        formValidate: {
          name: [{required: true, message: '请填写车辆名称', trigger: 'blur'}],
          plateNumber: [{required: true, message: '请选择车牌号', trigger: 'change'}],
          reason: [{required: true, message: '请填写违章原因', trigger: 'blur'}],
          fine: [{required: true, message: '请填写罚款金额', trigger: 'blur'}],
          uid: [{required: true, message: '请选择所属车主', trigger: 'change'}],
        },
        op: 'add',
        users: [],
        plateData: []
      }
    },
    methods: {
      onUIdChange(uid) {
        if (uid) {
          this.plateData = []
          this.formData.plateNumber = ''
          post(url.getVehicle, {uid}).then(res => {
            const {list} = res.data;
            list.forEach(i => this.plateData.push({label: i.plateNumber, value: i.plateNumber}))
          }).catch(err => console.log(err))
        }
      },
      getAccount() {
        post(url.getAccount, {}).then(res => {
          const {list} = res.data;
          list.filter(i => i.role === 'USER').forEach(i => this.users.push({label: i.nickname, value: i.id.toString()}))
        }).catch(err => console.log(err))
      },
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
            post(url.addRecord, param).then(res => {
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
          const {name, plateNumber, description, id, uid} = data;
          this.id = id;
          this.formData.name = name;
          this.formData.plateNumber = plateNumber;
          this.formData.description = description;
          this.formData.uid = uid.toString();
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
