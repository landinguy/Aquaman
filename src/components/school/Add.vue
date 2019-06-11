<template>
  <div class="bg">
    <Form ref="form" :model="formData" :rules="formValidate" :label-width="100">
      <FormItem label="学校名称" prop="name">
        <Input v-model.trim="formData.name" placeholder="请填写学校名称"/>
      </FormItem>
      <FormItem label="英文名称" prop="englishName">
        <Input v-model.trim="formData.englishName" placeholder="请填写学校英文名称"/>
      </FormItem>
      <FormItem label="校训" prop="motto">
        <Input v-model.trim="formData.motto" type="textarea" :rows="4" placeholder="请填写校训内容"></Input>
      </FormItem>
      <FormItem label="所属区域" prop="area">
        <Input v-model.trim="formData.area" placeholder="请填写学校所属区域"/>
      </FormItem>
      <FormItem label="管理单位" prop="competentDepartment">
        <Input v-model.trim="formData.competentDepartment" placeholder="请填写管理单位"/>
      </FormItem>
      <FormItem label="学校类型" prop="schoolTypeCode">
        <RadioGroup v-model="formData.schoolTypeCode">
          <Radio label="0" :disabled="op=='view'">
            <span>私立学校</span>
          </Radio>
          <Radio label="1" :disabled="op=='view'">
            <span>公立学校</span>
          </Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="学校地址" prop="address">
        <Input v-model.trim="formData.address" placeholder="请填写学校地址"/>
      </FormItem>
      <FormItem label="学校官网" prop="website">
        <Input v-model.trim="formData.website" placeholder="请填写学校官网"/>
      </FormItem>
      <FormItem label="学校简介" prop="description">
        <Input v-model.trim="formData.description" type="textarea" :rows="4" placeholder="请填写学校简介"></Input>
      </FormItem>
      <FormItem label="校徽图片">
        <Upload ref="upload"
                :action="uploadUrl"
                :format="['jpg','jpeg','png']"
                :show-upload-list="true"
                :before-upload="handleBeforeUpload"
                :on-success="handleSuccess"
                :on-remove="handleRemove"
                :with-credentials="true"
                style="display: inline-block">
          <Button type="default" icon="ios-cloud-upload-outline">上传文件</Button>
        </Upload>
      </FormItem>
    </Form>
    <div class="btn_div">
      <template v-if="op!='view'">
        <Button type="primary" shape="circle" class="radio_len" @click="confirm">提交</Button>
        <Button type="default" shape="circle" class="radio_len" style="margin-left: 20px" @click="cancel">取消</Button>
      </template>
    </div>
  </div>
</template>
<script>
  import axios from 'axios';
  import url from '@/api/url'
  import baseUrl from "@/libs/url"
  import {post, put} from "@/api/ax";

  export default {
    name: 'Add',
    data() {
      return {
        uploadUrl: baseUrl.base + url.uploadImg,
        op: '',
        formData: {
          name: '',
          englishName: '',
          motto: '',
          area: '',
          competentDepartment: '',
          schoolTypeCode: '1',
          address: '',
          website: '',
          badge: '',
          description: '',
        },
        id: '',
        formValidate: {
          name: [{required: true, message: '请填写学校名称', trigger: 'blur'}]
        },
      }
    },
    methods: {
      handleBeforeUpload(file) {
        let index = file.name.lastIndexOf(".");
        let type = file.name.substring(index + 1);

        let arr = ['jpg', 'jpeg', 'png'];
        if (arr.indexOf(type.toLowerCase()) == -1) {
          this.$Message.error('请上传jpg、png、jpeg图片文件');
          return false;
        }
        if (this.$refs.upload.fileList.length > 0) {
          this.$refs.upload.clearFiles();
        }
      },
      handleSuccess(res, file) {
        if (res.data) {
          console.log("res ->" + JSON.stringify(res.data));
          // this.formData.badge = baseUrl.base + '/' + res.data;
          this.formData.badge = 'http://220.248.55.84:8888/' + res.data;
          this.$Message.success('上传成功');
        } else {
          this.$Message.error('上传失败');
        }
      },
      handleRemove() {
        this.formData.badge = '';
      },
      confirm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            const {id} = this.formData
            // this.disableFlag = true;
            if (id) {
              put(url.addSchool, this.formData).then(res => {
                if (res.ret_code == 0) {
                  this.$Message.success({
                    content: '提交成功',
                    duration: 1,
                    onClose: () => this.$parent.getData(true)
                  })
                } else {
                  this.$Message.error(res.error_msg ? res.error_msg : '提交失败');
                  // this.disableFlag = false;
                }
              }).catch(err => console.log(err))
            } else {
              post(url.addSchool, this.formData).then(res => {
                if (res.ret_code == 0) {
                  this.$Message.success({
                    content: '提交成功',
                    duration: 1,
                    onClose: () => this.$parent.getData(true)
                  })
                } else {
                  this.$Message.error(res.error_msg ? res.error_msg : '提交失败');
                  // this.disableFlag = false;
                }
              }).catch(err => console.log(err))
            }
          }
        })
      },
      cancel() {
        this.$refs.form.resetFields();
        this.$parent.getData(true);
      },
      setData(data) {
        if (data) {
          const {schoolType} = this.$parent.school
          this.formData = this.$parent.school
          this.formData.schoolTypeCode = schoolType == 'PRIVATE' ? '0' : schoolType == 'PUBLIC' ? '1' : ''
        }
      }
    },
    mounted() {
      // this.setData();

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
