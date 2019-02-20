<template>
  <div class="bg">
    <Form ref="form" :model="formData" :rules="formValidate" :label-width="100">
      <FormItem label="用户名" prop="username">
        <Input v-model.trim="formData.username" placeholder="请填写用户名"/>
      </FormItem>
      <FormItem label="密码" prop="password">
        <Input v-model.trim="formData.password" type="password" placeholder="请填写密码"/>
      </FormItem>
      <FormItem label="昵称" prop="nickname">
        <Input v-model.trim="formData.nickname" placeholder="请填写昵称"/>
      </FormItem>

      <FormItem label="角色" prop="role">
        <Select v-model="formData.role" multiple>
          <Option value="PRESIDENT">校长</Option>
          <Option value="GRADE_LEADER">年级主任</Option>
          <Option value="CLASS_TEACHER">班主任</Option>
          <Option value="TEACHER">任课教师</Option>
          <Option value="STUDENT">学生</Option>
        </Select>
      </FormItem>
    </Form>
    <div class="btn_div">
      <template v-if="op!='view'">
        <Button type="primary" class="radio_len" @click="confirm">提交</Button>
        <Button type="ghost" class="radio_len" style="margin-left: 20px" @click="cancel">取消</Button>
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
          username: '',
          password: '',
          nickname: '',
          role: [],
        },
        id: '',
        formValidate: {
          username: [{required: true, message: '请填写用户名', trigger: 'blur'}],
          password: [{required: true, message: '请填写密码', trigger: 'blur'}],
          nickname: [{required: true, message: '请填写昵称', trigger: 'blur'}],
          role: [{required: true, type: 'array', min: 1, message: '请选择至少一个角色', trigger: 'change'}],
        },
      }
    },
    methods: {
      back() {
        this.$parent.content = 1;
      },
      confirm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            console.log(this.formData)
            // post(url.addClazz, rest).then(res => {
            //   if (res.ret_code && res.ret_code == 400) {
            //     this.$Message.error('该班级已存在');
            //   } else if (res == 'success') {
            //     this.$Message.success({
            //       content: '提交成功',
            //       duration: 1,
            //       onClose: () => {
            //         // if (this.op == 'modify' || this.op == 'copy') {
            //         //   this.$parent.content = 1;
            //         //   this.$parent.search();
            //         // } else {
            //         //   this.$router.push({name: 'template_list'});
            //         // }
            //       }
            //     })
            //   }
            // }).catch(err => console.log(err))
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
      }
    },
    mounted() {
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
