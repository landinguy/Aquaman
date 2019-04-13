<template>
  <div ref="BarVue">
    <div v-show="hasData" id="bar2"></div>
    <div v-show="!hasData" class="nodata">暂无数据</div>
  </div>
</template>

<script>
  let echarts = require('echarts');
  export default {
    name: 'Bar2',
    props: {
      hasData: {type: Boolean, default: true}
    },
    data() {
      return {
        bar: null,
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
      }
    },
    methods: {
      initBar() {
        let bar = echarts.init(document.getElementById('bar2'));
        bar.setOption(this.barOption);
        this.bar = bar;
      },
      reloadBar({barX, barY, total}) {
        this.barOption.series[0].data = barX;
        this.barOption.yAxis.data = barY;
        this.barOption.title.text = total;
        this.initBar();
      }
    },
    computed: {},
    mounted() {
      this.initBar();
    }

  }
</script>

<style scoped>
  #bar2 {
    height: 300px;
  }

  .nodata {
    text-align: center;
    line-height: 300px;
    color: darkgrey;
    font-size: 14px;
    /*border: 1px solid black;*/
  }
</style>
