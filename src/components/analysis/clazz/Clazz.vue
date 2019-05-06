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
          <!--<Option value="5">当前学期</Option>-->
          <!--<Option value="6">当前学年</Option>-->
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
    <RadioGroup v-model="params.type" @on-change="search" type="button" style="margin-bottom: 32px">
      <Radio label="1"><span>发布统计</span></Radio>
      <Radio label="2"><span>批改统计</span></Radio>
      <Radio label="3"><span>评价统计</span></Radio>
    </RadioGroup>
    <Chart ref="chart"></Chart>
  </div>
</template>
<script>
  import url from '@/api/url';
  import {post, get, $get} from "@/api/ax";
  import Chart from '@/components/common/chart/Chart'

  export default {
    name: 'Clazz',
    components: {Chart},
    data() {
      return {
        showPie: false,
        params: {
          timeType: '1',
          stageId: '',
          gradeId: '',
          type: '1',
          // startDate: '',
          // endDate: '',
        },
        grades: [],
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
        this.getData();
      },
      getData() {
        $get(url.clazzAnalysis, this.params).then(res => {
          let barX = [];
          let barY = [];
          let pieData = [];
          if (res.data) {
            const {total, stat} = res.data;
            stat.forEach(item => {
              const {clazzName, cnt} = item;
              barX.push(cnt);
              barY.push(clazzName);
              pieData.push({value: cnt, name: clazzName});
            })
            this.$refs.chart.reloadChart({total, barX, barY, pieData});
          } else {
            this.$refs.chart.reloadChart({barX, barY, pieData});
          }
        }).catch(err => console.log(err))
      },
    },
    computed: {},
    mounted() {
      this.search();
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
