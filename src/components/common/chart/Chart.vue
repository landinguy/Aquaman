<template>
  <div class="content">
    <Row type="flex" justify="space-between" style="min-width: 800px">
      <Col span="10">
        <Bar ref="BarVue" :has-data="showBarOrPie"></Bar>
      </Col>
      <Col span="10">
        <Pie ref="PieVue" :has-data="showBarOrPie"></Pie>
      </Col>
    </Row>
    <!--<div id="line"></div>-->
    <div class="line-nodata">暂无数据</div>
  </div>
</template>
<script>
  import {post, get} from "@/api/ax"
  import Bar from './Bar'
  import Pie from './Pie'

  let echarts = require('echarts');
  export default {
    name: 'Chart',
    components: {Bar, Pie},
    data() {
      return {
        showBarOrPie: true,
        lineOption: {
          // title: {
          //   text: '折线图堆叠'
          // },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['七年级', '八年级', '九年级']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: '七年级',
              type: 'line',
              data: [12, 13, 10, 13, 9, 23, 21]
            },
            {
              name: '八年级',
              type: 'line',
              data: [22, 18, 19, 23, 29, 33, 31]
            },
            {
              name: '九年级',
              type: 'line',
              data: [15, 23, 20, 15, 19, 33, 41]
            }
          ]
        }
      }
    },
    methods: {
      reloadChart({total, barX, barY, pieData}) {
        console.log("#####{}", barY.length);
        if (barY.length > 0) {
          total = `合计：${total}`
          this.showBarOrPie = true;
          this.$refs.BarVue.reloadBar({barX, barY, total});
          this.$refs.PieVue.reloadPie({barY, pieData});
        } else {
          this.showBarOrPie = false
        }
      }
    },
    computed: {},
    mounted() {
      // let line = echarts.init(document.getElementById('line'));
      // line.setOption(this.lineOption);
      // this.lineChart = line;

      /** 浏览器窗口大小改变时，图表宽高自适应  **/
      setTimeout(() => {
        window.onresize = () => {
          this.$refs.BarVue.bar.resize();
          this.$refs.PieVue.pie.resize();
          // line.resize();
        }
      }, 200)
    }
  }
</script>
<style scoped lang="less">
  .content {
    overflow: auto;

    #line {
      height: 300px;
      margin-top: 32px;
      min-width: 800px
    }

    .nodata {
      text-align: center;
      line-height: 300px;
      color: darkgrey;
      font-size: 14px;
      /*border: 1px solid black;*/
    }

    .line-nodata {
      .nodata;
      margin-top: 32px;
    }
  }
</style>
