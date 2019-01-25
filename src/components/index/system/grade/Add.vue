<template>
  <div ref="AddVue">
    <Modal v-model="addModal">
      <p slot="header" style="text-align:center">
        <span>{{op}}年级</span>
      </p>
      <div>
        <Form ref="form" :model="formData" :rules="formValidate" :label-width="100">
          <FormItem label="学段" prop="stageId">
            <Select v-model="formData.stageId">
              <Option v-for="t in stages" :value="t.id" :key="t.id">{{t.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="年级名称" prop="gradeName">
            <Input v-model.trim="formData.gradeName" placeholder="请输入年级名称" class="input_len"/>
          </FormItem>
        </Form>
      </div>
      <div slot="footer" style="text-align: center">
        <Button type="primary" @click="confirm">提交</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import axios from 'axios';
  import url from '@/api/url'
  import baseUrl from "@/libs/url"

  export default {
    name: 'Add',
    data() {
      return {
        addModal: false,
        op: '添加',
        formData: {gradeName: '', stageId: ''},
        id: '',
        formValidate: {
          gradeName: [{required: true, message: '请输入年级名称', trigger: 'blur'}],
          stageId: [{required: true, message: '请选择学段', trigger: 'change'}]
        },
        stages: []
      }
    },
    methods: {
      confirm() {
        this.$refs.form.validate((valid) => {
          if (valid) {

          }
        })
      },
      setData(op, data) {
        this.id = '';
        this.op = op;
        if (data) {
          this.id = data.id;
          this.formData.content = data.content;
        }
        this.addModal = true;
      }
    },
    watch: {
      addModal(curVal, oldVal) {
        if (curVal) {
        } else {
          this.$refs.form.resetFields();
        }
      }
    }
  }
</script>
<style lang="less">

</style>
