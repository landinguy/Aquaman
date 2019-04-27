<template>
  <div class="bg">
    <div v-if="content==2">
      <Add ref="addVue"></Add>
    </div>
    <div v-if="content==1">
      <div v-if="school!=null">
        <Card>
          <p slot="title">学校简介</p>
          <Row type="flex" justify="space-between" align="middle">
            <Col span="4">
              <img :src="school.badge" style="height: 160px;width: 160px">
            </Col>
            <Col span="18">
              <P class="desc">{{school.description}}</P>
            </Col>
          </Row>
        </Card>
        <Card style="margin: 16px 0">
          <p slot="title">其他信息</p>
          <Row>
            <Col span="12">
              <div class="line"><label>校名</label><span>{{school.name}}</span></div>
              <div class="line"><label>英文名</label><span>{{school.englishName}}</span></div>
              <div class="line"><label>校训</label><span>{{school.motto}}</span></div>
              <div class="line"><label>学校类型</label><span>{{school.schoolType=='PUBLIC'?'公立学校':'私立学校'}}</span></div>
            </Col>
            <Col span="12">
              <div class="line"><label>所属区域</label><span>{{school.area}}</span></div>
              <div class="line"><label>管理单位</label><span>{{school.competentDepartment}}</span></div>
              <div class="line"><label>学校地址</label><span>{{school.address}}</span></div>
              <div class="line"><label>学校官网</label><span><a :href="school.website">{{school.website}}</a></span>
              </div>
            </Col>
          </Row>
        </Card>
      </div>
      <div v-if="school==null">
        <p class="no-info">暂无学校信息</p>
      </div>
      <div v-if="roleId=='ADMIN'" class="btn">
        <Button type="ghost" shape="circle" @click="edit()" style="width: 80px">{{school!=null?'编辑':'添加'}}</Button>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapMutations, mapGetters} from 'vuex'
  import {showTip, timestampToTime} from '@/libs/util'
  import url from '@/api/url'
  import {post, get, $del} from "@/api/ax"
  import Add from './Add.vue'

  export default {
    name: 'Info',
    data() {
      return {
        content: 1,
        school: null
      }
    },
    components: {Add},
    methods: {
      edit() {
        this.content = 2
        setTimeout(() => this.$refs.addVue.setData(this.school), 200)
      },
      getData(flag) {
        get(url.getSchool, {}).then(res => {
          const {list} = res.data
          if (list.length > 0) this.school = list[0]
        }).catch(err => console.log(err))
        if (flag) this.content = 1
      }
    },
    mounted() {
      this.getData(false)
    },
    computed: {
      ...mapGetters(['accountId', 'roleId'])
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

  .no-info {
    color: gray;
    font-size: 16px;
  }
</style>
