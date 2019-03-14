<template>
  <div class="bg">
    <div v-if="content==2">
      <Add></Add>
    </div>
    <div v-if="content==1">
      <Card>
        <p slot="title">学校简介</p>
        <Row type="flex" justify="space-between" align="middle">
          <Col span="4">
            <img :src="data.badge" style="height: 160px;width: 160px">
          </Col>
          <Col span="18">
            <P class="desc">{{data.description}}</P>
          </Col>
        </Row>
      </Card>
      <Card style="margin: 16px 0">
        <p slot="title">其他信息</p>
        <Row>
          <Col span="12">
            <div class="line"><label>校名</label><span>{{data.name}}</span></div>
            <div class="line"><label>英文名</label><span>{{data.englishName}}</span></div>
            <div class="line"><label>校训</label><span>{{data.motto}}</span></div>
            <div class="line"><label>学校类型</label><span>{{data.schoolTypeCode==1?'公立学校':'私立学校'}}</span></div>
          </Col>
          <Col span="12">
            <div class="line"><label>所属区域</label><span>{{data.area}}</span></div>
            <div class="line"><label>管理单位</label><span>{{data.competentDepartment}}</span></div>
            <div class="line"><label>学校地址</label><span>{{data.address}}</span></div>
            <div class="line"><label>学校官网</label><span><a href="http://www.pku.edu.cn">{{data.website}}</a></span></div>
          </Col>
        </Row>
      </Card>
      <div class="btn">
        <Button type="ghost" shape="circle" @click="edit()" style="width: 80px">编辑</Button>
      </div>
    </div>
  </div>
</template>
<script>
  import {showTip, timestampToTime} from '@/libs/util'
  import url from '@/api/url'
  import {post, $del} from "@/api/ax"
  import Add from './Add.vue'

  export default {
    name: 'Info',
    data() {
      return {
        content: 1,
        data: {}
      }
    },
    components: {Add},
    methods: {
      edit() {
        this.content = 2
      },
      getData() {
        post(url.getSchool, {}).then(res => this.data = res.data).catch(err => console.log(err))
      },
    },
    mounted() {
      this.getData();
    },
    computed: {}
  }
</script>
<style scoped lang="less">
  .bg {
    background-color: white;
    width: 100%;
    height: 100%;
    padding: 32px;
  }

  .desc {
    font-size: 16px;
    color: #333333;
    line-height: 32px;
  }

  .line {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    font-size: 14px;
    margin-bottom: 16px;

    label {
      font-weight: bold;
      margin-right: 16px;
      min-width: 80px;
    }
  }

  .btn {
    text-align: center;
  }
</style>
