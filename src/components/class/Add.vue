<template>
  <div ref="AddVue">
    <Modal v-model="addModal" width="640">
      <p slot="header" style="text-align:center">
        <span>{{op==='add'?'添加':'编辑'}}班级</span>
      </p>
      <div>
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
        formData: {stageId: '', gradeId: '', clazzName: ''},
        id: '',
        formValidate: {
          stageId: [{required: true, message: '请选择学段', trigger: 'change'}],
          gradeId: [{required: true, message: '请选择年级', trigger: 'change'}],
          clazzName: [{required: true, message: '请填写班级名称', trigger: 'blur'}]
        },
        grades: [],
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
      getGrades() {
        this.grades = [];
        this.formData.gradeId = '';
        let stageId = this.formData.stageId;
        if (stageId) {
          get(url.getGradesByStageId + stageId, {}).then(res =>
            res.data.forEach(item => this.grades.push({label: item.gradeName, value: item.gradeId}))
          ).catch(err => console.log(err))
        }

      },
      cancel() {
        this.addModal = false;
      },
      confirm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            const {stageId, ...rest} = this.formData;
            if (this.id == '') {
              post(url.addClazz, rest).then(res => {
                if (res.ret_code && res.ret_code == 400) {
                  this.$Message.error('该班级已存在');
                } else if (res == 'success') {
                  this.$Message.success({
                    content: '提交成功',
                    duration: 1,
                    onClose: () => {
                      this.cancel();
                      this.$parent.getData();
                    }
                  })
                }
              }).catch(err => console.log(err))
            } else {
              let clazzId = this.id;
              put(url.updateClazz, {...rest, clazzId}).then(res => {
                if (res.ret_code == 0) {
                  this.$Message.success({
                    content: '提交成功',
                    duration: 1,
                    onClose: () => {
                      this.cancel();
                      this.$parent.search();
                    }
                  })
                } else {
                  this.$Message.error(`修改失败 [${res.error_msg}]`)
                }
              }).catch(err => console.log(err))
            }
          }
        })
      },
      setData(data) {
        if (data) {
          const {stageName, gradeName, clazzName, clazzId} = data;
          this.id = clazzId;
          this.formData.stageId = stageName === '小学' ? '1' : stageName === '初中' ? '2' : '3';
          this.formData.clazzName = clazzName;
          this.getGrades();
          setTimeout(() => {
            for (let g of this.grades) {
              if (g.label == gradeName) {
                this.formData.gradeId = g.value;
                break
              }
            }
          }, 200);
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
