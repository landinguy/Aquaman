<template>
  <div class="bg">
    <Chart></Chart>
  </div>
</template>
<script>
  import url from '@/api/url';
  import {post, get} from "@/api/ax";
  import Chart from '@/components/common/chart/Chart'

  export default {
    name: 'Teacher',
    components: {Chart},
    data() {
      return {
        showPie: false
      }
    },
    methods: {},
    computed: {},
    mounted() {
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
</style>
