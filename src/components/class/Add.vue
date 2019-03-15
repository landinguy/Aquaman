<template>
  <div class="bg">
    <Form ref="form" :model="formData" :rules="formValidate" :label-width="100">
      <FormItem label="学段" prop="stageId">
        <Select v-model="formData.stageId" @on-change="getGrades">
          <Option value="1">小学</Option>
          <Option value="2">初中</Option>
          <Option value="3">高中</Option>
        </Select>
      </FormItem>

      <FormItem label="年级" prop="gradeId">
        <Select v-model="formData.gradeId">
          <Option v-for="item in grades" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>

      <FormItem label="班级" prop="clazzName">
        <Input v-model.trim="formData.clazzName" placeholder="请填写班级名称"/>
      </FormItem>
    </Form>
    <div class="btn_div">
      <template v-if="op!='view'">
        <Button type="primary" shape="circle" class="radio_len" @click="confirm">提交</Button>
        <Button type="ghost" shape="circle" class="radio_len" style="margin-left: 20px" @click="cancel">取消</Button>
      </template>
      <template v-if="op=='view'">
        <Button type="ghost" class="radio_len" style="margin-left: 20px" @click="back">返回</Button>
      </template>
    </div>
  </div>
</template>
<script>
  import axios from 'axios';
  import url from '@/api/url'
  import baseUrl from "@/libs/url"
  import {post, get} from "@/api/ax";

  export default {
    name: 'Add',
    data() {
      return {
        op: '',
        formData: {
          stageId: '1',
          gradeId: '',
          clazzName: '',
        },
        id: '',
        formValidate: {
          stageId: [{required: true, message: '请选择学段', trigger: 'change'}],
          gradeId: [{required: true, message: '请选择年级', trigger: 'change'}],
          clazzName: [{required: true, message: '请填写班级名称', trigger: 'blur'}]
        },
        grades: []
      }
    },
    methods: {
      back() {
        this.$parent.content = 1;
      },
      confirm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            const {stageId, ...rest} = this.formData;
            post(url.addClazz, rest).then(res => {
              if (res.ret_code && res.ret_code == 400) {
                this.$Message.error('该班级已存在');
              } else if (res == 'success') {
                this.$Message.success({
                  content: '提交成功',
                  duration: 1,
                  onClose: () => {
                    // if (this.op == 'modify' || this.op == 'copy') {
                    //   this.$parent.content = 1;
                    //   this.$parent.search();
                    // } else {
                    //   this.$router.push({name: 'template_list'});
                    // }
                  }
                })
              }
            }).catch(err => console.log(err))
          }
        })
      },
      cancel() {
        if (this.op == 'modify' || this.op == 'copy') {
          this.$parent.content = 1;
        } else {
          this.$refs.form.resetFields();
        }
      },
      setData(op, data) {
        this.id = '';
        this.op = op;
        if (data) {
          this.id = data.id;
          this.formData.content = data.content;
        }
      },
      getGrades() {
        this.grades = [];
        this.formData.gradeId = '';
        let stageId = this.formData.stageId;
        get(url.getGradesByStageId + stageId, {}).then(res =>
          res.data.forEach(item => this.grades.push({label: item.gradeName, value: item.gradeId}))
        ).catch(err => console.log(err))
      }
    },
    mounted() {
      this.getGrades();

      // VueEvent.$on('on-open-page', name => this.back());
      // this.getSignList();
      // this.id = this.$store.state.template.id;
      // this.op = this.$store.state.template.operation;
      // if (this.id != '' && this.op != '') {//根据id查询模板
      //   console.log("op:" + this.op + ", id:" + this.id);
      //   this.search(this.id);
      // }
    },
    beforeDestroy() {

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

  .btn_div {
    text-align: center;
    width: 100%;
    margin-top: 40px;
  }

  .radio_len {
    width: 80px;
    text-align: center;
  }
</style>
