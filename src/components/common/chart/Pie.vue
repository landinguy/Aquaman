<template>
  <div ref="PieVue">
    <div v-show="hasData" id="pie"></div>
    <div v-show="!hasData" class="nodata">暂无数据</div>
  </div>
</template>

<script>
  let echarts = require('echarts');
  export default {
    name: 'Pie',
    props: {
      hasData: {type: Boolean, default: true}
    },
    data() {
      return {
        pie: null,
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
      }
    },
    methods: {
      initPie() {
        let pie = echarts.init(document.getElementById('pie'));
        pie.setOption(this.pieOption);
        this.pie = pie;
      },
      reloadPie({barY, pieData}) {
        this.pieOption.legend.data = barY;
        this.pieOption.series[0].data = pieData;
        this.initPie();
      }
    },
    computed: {},
    mounted() {
      this.initPie();
    }

  }
</script>

<style scoped>
  #pie {
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
