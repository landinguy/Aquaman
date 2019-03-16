<template>
  <div class="content">
    <Row type="flex" justify="space-between" style="min-width: 800px">
      <Col span="10">
        <div v-show="showBarOrPie" id="bar"></div>
        <div v-show="!showBarOrPie" class="nodata">暂无数据</div>
      </Col>
      <Col span="10">
        <div v-show="showBarOrPie" id="pie"></div>
        <div v-show="!showBarOrPie" class="nodata">暂无数据</div>
      </Col>
    </Row>
    <!--<div id="line"></div>-->
    <div class="line-nodata">暂无数据</div>
  </div>
</template>
<script>
  import url from '@/api/url'
  import {post, get} from "@/api/ax"

  let echarts = require('echarts');
  export default {
    name: 'Chart',
    components: {},
    data() {
      return {
        showBarOrPie: true,
        pieChart: null,
        lineChart: null,
        barOption: {
          title: {
            text: '合计：0',
            // subtext: '副标题',
            x: 'center',
            y: 'top'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
          },
          yAxis: {
            type: 'category',
            data: []
          },
          series: [
            {
              type: 'bar',
              barWidth: 20,//柱图宽度
              data: []
            }
          ]
        },
        pieOption: {
          // title: {
          //   text: '某站点用户访问来源',
          //   subtext: '纯属虚构',
          //   x: 'center'
          // },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: []
          },
          series: [
            {
              name: '占比',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: [],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        },
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
          this.showBarOrPie = true;

          this.barOption.series[0].data = barX;
          this.barOption.yAxis.data = barY;
          this.barOption.title.text = '合计：' + total;
          this.initBar();

          this.pieOption.legend.data = barY;
          this.pieOption.series[0].data = pieData;
          this.initPie();
        } else {
          this.showBarOrPie = false
        }
      },
      initBar() {
        let bar = echarts.init(document.getElementById('bar'));
        bar.setOption(this.barOption);
        return bar;
      },
      initPie() {
        let pie = echarts.init(document.getElementById('pie'));
        pie.setOption(this.pieOption);
        return pie;
      }
    },
    computed: {},
    mounted() {
      let bar = this.initBar();
      let pie = this.initPie();

      // let line = echarts.init(document.getElementById('line'));
      // line.setOption(this.lineOption);
      // this.lineChart = line;

      /** 浏览器窗口大小改变时，图表宽高自适应  **/
      setTimeout(() => {
        window.onresize = () => {
          bar.resize();
          pie.resize();
          // line.resize();
        }
      }, 200)
    }
  }
</script>
<style scoped lang="less">
  .content {
    overflow: auto;

    #bar, #pie {
      height: 300px;
    }

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
