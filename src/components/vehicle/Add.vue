<template>
  <div ref="AddVue">
    <Modal v-model="addModal" width="640">
      <p slot="header" style="text-align:center">
        <span>{{op==='add'?'添加':'编辑'}}车辆</span>
      </p>
      <div>
        <Form ref="form" :model="formData" :rules="formValidate" :label-width="100">
          <FormItem label="车辆名" prop="name">
            <Input v-model.trim="formData.name" placeholder="请填写车辆名称"/>
          </FormItem>
          <FormItem label="车牌号" prop="plateNumber">
            <Input v-model.trim="formData.plateNumber" placeholder="请填写车牌号"/>
          </FormItem>
          <FormItem label="车辆类型" prop="type">
            <Select v-model="formData.type">
              <Option value="1">电动车</Option>
              <Option value="2">小汽车</Option>
              <Option value="3">小型客车</Option>
              <Option value="4">大型客车</Option>
            </Select>
          </FormItem>
          <FormItem label="所属车主" prop="uid">
            <Select v-model="formData.uid" @on-change="onChangeUid">
              <Option v-for="item in users" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="购买日期" prop="buyTs">
            <DatePicker v-model="formData.buyTs" type="date" placeholder="请选择车辆购买日期" style="width: 200px"></DatePicker>
          </FormItem>
          <FormItem label="备注" prop="description">
            <Input v-model.trim="formData.description" type="textarea" :rows="4" placeholder="请填写备注信息"/>
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
  import {timestampToTime} from '@/libs/util'

  export default {
    name: 'Add',
    data() {
      return {
        addModal: false,
        formData: {
          name: '',
          plateNumber: '',
          uid: '',
          username: '',
          description: '',
          type: '',
          buyTs: ''
        },
        id: '',
        formValidate: {
          name: [{required: true, message: '请填写车辆名称', trigger: 'blur'}],
          plateNumber: [{required: true, message: '请填写车牌号', trigger: 'blur'}],
          description: [{required: true, message: '请填写备注信息', trigger: 'blur'}],
          uid: [{required: true, message: '请选择所属车主', trigger: 'change'}],
          type: [{required: true, message: '请选择车辆类型', trigger: 'change'}],
        },
        op: 'add',
        users: []
      }
    },
    methods: {
      onChangeUid(uid) {
        if (uid) {
          for (let u of this.users) {
            if (uid == u.value) {
              this.formData.username = u.label
              break
            }
          }
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
            param.buyTs = timestampToTime(param.buyTs, 'date');
            param.id = this.id;
            post(url.addVehicle, param).then(res => {
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
          const {name, plateNumber, description, id, uid, username, type, buyTs} = data;
          this.id = id;
          this.formData.name = name;
          this.formData.username = username;
          this.formData.plateNumber = plateNumber;
          this.formData.description = description;
          this.formData.type = type.toString();
          this.formData.buyTs = new Date(timestampToTime(parseInt(buyTs), 'date'));
          if (uid) this.formData.uid = uid.toString();
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
