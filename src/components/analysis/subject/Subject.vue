<template>
  <div class="bg">
    <div class="search-div">
      <div class="search-div-item">
        <label>时间</label>
        <Input v-model="params.time" placeholder="快速查找" class="width"/>
      </div>
      <div class="search-div-item">
        <label>学段</label>
        <Input v-model="params.stageId" placeholder="快速查找" class="width"/>
      </div>
      <div class="search-div-item">
        <label>年级</label>
        <Input v-model="params.grade" placeholder="快速查找" class="width"/>
      </div>
      <div class="search-div-item">
        <Button type="primary" @click="search">查询</Button>
      </div>
    </div>
    <RadioGroup v-model="params.name" @on-change="changeItem" type="button" style="margin-bottom: 32px">
      <Radio label="1"><span>发布作业班次</span></Radio>
      <Radio label="2"><span>批改作业次数</span></Radio>
      <Radio label="3"><span>评价作业次数</span></Radio>
    </RadioGroup>
    <Chart></Chart>
  </div>
</template>
<script>
  import url from '@/api/url';
  import {post, get} from "@/api/ax";
  import Chart from '@/components/common/chart/Chart'
  import './subject.less'

  export default {
    name: 'Subject',
    components: {Chart},
    data() {
      return {
        showPie: false,
        params: {
          time: '',
          stageId: '',
          grade: '',
          name: '1',
          pageNo: 1,
          pageSize: 10
        },
        tag1: true,
        tag2: false,
        tag3: false
      }
    },
    methods: {
      changeItem(item) {
        console.log(item)
      },
      search() {
        this.params.pageNo = 1;
        this.getTotal();
        this.getData();
      },
      getData() {
        post(url.getAccounts, this.params).then(res => this.tableData = res.data).catch(err => console.log(err))
      },
      getTotal() {
        const {find} = this.params;
        post(url.getAccountCount, {find}).then(res => this.total = res.data).catch(err => console.log(err))
      }
    },
    computed: {},
    mounted() {
    }
  }
</script>
