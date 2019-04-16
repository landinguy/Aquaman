<template>
  <div class="bg">
    <div class="search-div">
      <div class="search-div-item">
        <label>时间</label>
        <Select v-model="params.timeType" class="width">
          <Option value="1">今日</Option>
          <Option value="2">昨天</Option>
          <Option value="3">近7日</Option>
          <Option value="4">近30日</Option>
        </Select>
      </div>
      <div class="search-div-item">
        <label>学段</label>
        <Select v-model="params.stageId" @on-change="getGrades" class="width">
          <Option value="1">小学</Option>
          <Option value="2">初中</Option>
          <Option value="3">高中</Option>
        </Select>
      </div>
      <div class="search-div-item">
        <label>年级</label>
        <Select v-model="params.gradeId" class="width">
          <Option v-for="item in grades" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div class="search-div-item">
        <Button type="primary" @click="search">查询</Button>
      </div>
    </div>
    <Row type="flex" justify="space-between" style="min-width: 800px">
      <Col span="10">
        <Bar ref="BarVue" :has-data="hasData"></Bar>
      </Col>
      <Col span="10">
        <Bar2 ref="BarVue2" :has-data="hasData"></Bar2>
      </Col>
    </Row>
    <!--<Row type="flex" justify="center" style="min-width: 800px">-->
    <!--<Col span="12">-->
    <!--<Pie ref="Pie1" :has-data="hasData"></Pie>-->
    <!--</Col>-->
    <!--</Row>-->
    <!--<Row type="flex" justify="center" style="min-width: 800px;margin-top: 32px">-->
    <!--<Col span="12">-->
    <!--<Pie2 ref="Pie2" :has-data="hasData"></Pie2>-->
    <!--</Col>-->
    <!--</Row>-->
  </div>
</template>
<script>
  import url from '@/api/url';
  import {post, get, $get} from "@/api/ax";
  // import Pie from '@/components/common/chart/Pie'
  import Bar from '@/components/common/chart/Bar'
  import Bar2 from '@/components/common/chart/Bar2'
  // import Pie2 from '@/components/common/chart/Pie2'
  import {handleSpinCustom} from '@/libs/util'

  export default {
    name: 'Student',
    components: {Bar, Bar2},
    data() {
      return {
        params: {
          timeType: '1',
          stageId: '',
          gradeId: '',
          // startDate: '',
          // endDate: '',
        },
        grades: [],
        hasData: true
      }
    },
    methods: {
      getGrades() {
        this.grades = [];
        let stageId = this.params.stageId;
        get(url.getGradesByStageId + stageId, {}).then(res =>
          res.data.forEach(item => this.grades.push({label: item.gradeName, value: item.gradeId}))
        ).catch(err => console.log(err));
      },
      search() {
        this.getData(1);
        this.getData(2);
      },
      getData(type) {
        const {stageId, ...rest} = this.params
        $get(url.studentAnalysis, {type, ...rest}).then(res => {
          const {totalCnt, statList} = res.data
          if (statList.length > 0) {
            this.hasData = true
            // let title = type === 1 ? '提交率' : '按时提交率'
            let total = `合计： ${totalCnt}`
            let barY = []
            let barX = []
            statList.forEach(item => {
              const {clazzName, submitRate, cnt} = item
              let rate = this.parse(submitRate)
              barY.push(`${clazzName}(${rate})`)
              barX.push(cnt)
            })
            if (type === 1) this.$refs.BarVue.reloadBar({barX, barY, total});
            if (type === 2) this.$refs.BarVue2.reloadBar({barX, barY, total});
          } else {
            this.hasData = false
          }
        }).catch(err => console.log(err))
      },
      parse(t) {
        return parseFloat(t) * 100 + '%'
      }
    },
    computed: {},
    mounted() {
      this.hasData = false;
      /** 浏览器窗口大小改变时，图表宽高自适应  **/
      setTimeout(() => {
        window.onresize = () => {
          this.$refs.BarVue.bar.resize();
          this.$refs.BarVue2.bar.resize();
        }
      }, 200)
      this.search()
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

  .search-div {
    display: flex;
    justify-content: left;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 32px;

    &-item {
      margin-bottom: 16px;
    }
  }

  label {
    margin-right: 8px;
    font-weight: bold;
    display: inline-block;
  }

  .width {
    width: 160px;
    margin-right: 32px;
  }
</style>
