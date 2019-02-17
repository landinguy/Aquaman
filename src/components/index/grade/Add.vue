<template>
  <div class="bg">
    <Form ref="form" :model="formData" :rules="formValidate" :label-width="100">
      <FormItem label="学段" prop="stageId">
        <Select v-model="formData.stageId">
          <Option value="1">小学</Option>
          <Option value="2">初中</Option>
          <Option value="3">高中</Option>
        </Select>
      </FormItem>
      <FormItem label="年级名称" prop="gradeName">
        <Input v-model.trim="formData.gradeName" placeholder="请填写年级名称"/>
      </FormItem>
    </Form>
    <div class="btn_div">
      <template v-if="op!='view'">
        <Button type="primary" class="radio_len" @click="confirm" :disabled="disableFlag">提交</Button>
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
  import {post} from "@/api/ax";

  export default {
    name: 'Add',
    data() {
      return {
        disableFlag: false,
        op: '',
        formData: {
          stageId: '1',
          gradeName: '',
        },
        id: '',
        formValidate: {
          stageId: [{required: true, message: '请选择学段', trigger: 'change'}],
          gradeName: [{required: true, message: '请填写年级', trigger: 'blur'}]
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
            this.disableFlag = true;
            post(url.addGrade, this.formData).then(res => {
              console.log("-----------", res);

              this.$Message.success('提交成功');
              // if (res.code == 0) {
              //   this.$Message.success({
              //     content: '提交成功',
              //     duration: 1,
              //     onClose: () => {
              //       if (this.op == 'modify' || this.op == 'copy') {
              //         this.$parent.content = 1;
              //         this.$parent.search();
              //       } else {
              //         this.$router.push({name: 'template_list'});
              //       }
              //     }
              //   })
              // } else {
              //   this.$Message.error(res.msg ? res.msg : '提交失败');
              //   this.disableFlag = false;
              // }


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
