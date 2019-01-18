<template>
  <div>
    测试页面
    <h2>hello,{{name}}</h2>
  </div>
</template>
<script>
  import url from '@/api/url'
  import {post, get} from "@/api/ax"

  export default {
    name: 'Test',
    components: {},
    data() {
      return {
        name: ''
      }
    },
    methods: {},
    computed: {},
    mounted() {
      post(url.test, {}).then(res => this.name = res.data).catch(err => console.log(err))
    }
  }
</script>
