<template>
  <div ref="ApplyVue">
    <Modal v-model="addModal" width="640">
      <p slot="header" style="text-align:center">
        <span>申请班级</span>
      </p>
      <div>
        <Form ref="form" :model="formData" :rules="formValidate" :label-width="100">
          <FormItem label="班级名称" prop="classId">
            <Select v-model="formData.classId">
              <Option v-for="item in classes" :value="item.id.toString()" :key="item.id">{{ item.classname }}</Option>
            </Select>
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
  import {mapGetters} from 'vuex'
  import url from '@/api/url'
  import {$get} from "@/api/ax"

  export default {
    name: 'Apply',
    data() {
      return {
        addModal: false,
        formData: {
          classId: ''
        },
        formValidate: {
          classId: [{required: true, message: '请选择班级', trigger: 'change'}]
        },
        classes: []
      }
    },
    methods: {
      showModal() {
        this.addModal = true;
      },
      confirm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            let params = {userId: this.accountId, classId: this.formData.classId}
            // alert(JSON.stringify(params))
            $get(url.applyClass, params).then(res => {
              const {code, msg} = res;
              if (code === 0) {
                this.$Message.success({
                  content: '提交成功',
                  duration: 1,
                  onClose: () => {
                    this.cancel();
                    this.$parent.getClassName();
                  }
                })
              } else {
                this.$Message.error(msg);
              }
            }).catch(err => console.log(err));
          }
        })
      },
      cancel() {
        this.addModal = false;
      },
      getClass() {
        $get(url.getClass, null).then(res => {
          this.classes = res.data;
        }).catch(err => console.log(err));
      }
    },
    mounted() {
      this.getClass();
    },
    computed: {
      ...mapGetters(['accountId', 'roleId'])
    },
    watch: {
      addModal(curVal, oldVal) {
        if (!curVal) {
          this.$refs.form.resetFields();
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
