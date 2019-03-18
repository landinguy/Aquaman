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
          <Option value="5">当前学期</Option>
          <Option value="6">当前学年</Option>
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

    <Row type="flex" justify="center" style="min-width: 800px">
      <Col span="12">
        <Pie ref="Pie1" :has-data="hasData"></Pie>
      </Col>
    </Row>
    <Row type="flex" justify="center" style="min-width: 800px;margin-top: 32px">
      <Col span="12">
        <Pie2 ref="Pie2" :has-data="hasData"></Pie2>
      </Col>
    </Row>
  </div>
</template>
<script>
  import url from '@/api/url';
  import {post, get, $get} from "@/api/ax";
  import Pie from '@/components/common/chart/Pie'
  import Pie2 from '@/components/common/chart/Pie2'
  import {handleSpinCustom} from '@/libs/util'

  export default {
    name: 'Student',
    components: {Pie, Pie2},
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
        const {stageId, gradeId} = this.params;
        if (stageId && gradeId) {
          handleSpinCustom();
          setInterval(() => this.$Spin.hide(), 200);
          this.setData();
          this.hasData = true;
        } else {
          this.hasData = false;
        }
        this.getData();
      },
      getData() {
        // $get(url.subjectAnalysis, this.params).then(res => {
        //   let barX = [];
        //   let barY = [];
        //   let pieData = [];
        //   if (res.data) {
        //     const {total, stat} = res.data;
        //     stat.forEach(item => {
        //       const {subjectName, cnt} = item;
        //       barX.push(cnt);
        //       barY.push(subjectName);
        //       pieData.push({value: cnt, name: subjectName});
        //     })
        //     this.$refs.chart.reloadChart({total, barX, barY, pieData});
        //   } else {
        //     this.$refs.chart.reloadChart({barX, barY, pieData});
        //   }
        // }).catch(err => console.log(err))
      },
      setData() {
        this.$refs.Pie1.pieOption.title = {text: '作业提交率', x: 'center'}
        this.$refs.Pie2.pieOption.title = {text: '作业得分率', x: 'center'}
        let barY = ["0%~30.99%", "31%~60.99%", "61%~70.99%", "71%~80.99%", "81%~90.99%", "91%~100%"];
        let barY1 = ["0%~30.99%", "31%~60.99%", "61%~70.99%", "71%~80.99%", "81%~90.99%", "91%~100%"];
        let pieData = [
          {name: '0%~30.99%', value: 12}, {name: '31%~60.99%', value: 22}, {name: '61%~70.99%', value: 30},
          {name: '71%~80.99%', value: 40}, {name: '81%~90.99%', value: 20}, {name: '91%~100%', value: 10}
        ];
        let pieData1 = [
          {name: '0%~30.99%', value: '10'}, {name: '31%~60.99%', value: '12'}, {name: '61%~70.99%', value: '24'},
          {name: '71%~80.99%', value: '40'}, {name: '81%~90.99%', value: '35'}, {name: '91%~100%', value: '8'}
        ];
        this.$refs.Pie1.reloadPie({barY, pieData});
        this.$refs.Pie2.reloadPie({barY1, pieData1});
      }
    },
    computed: {},
    mounted() {
      this.hasData = false;
      /** 浏览器窗口大小改变时，图表宽高自适应  **/
      setTimeout(() => {
        window.onresize = () => {
          this.$refs.Pie1.pie.resize();
          this.$refs.Pie2.pie.resize();
        }
      }, 200)

      // this.$refs.PieVue.reloadPie({barY, pieData});
      // this.search()
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
