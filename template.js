/**
 * 组件快速生成脚本,执行命令 npm run temp `文件夹名` `文件名`
 */
const fs = require('fs');

const dirName = process.argv[2];
const filename = process.argv[3];

if (!dirName) {
  console.log('文件夹名称不能为空！');
  console.log('示例：npm run temp test Demo');
  process.exit(0);
}
if (!filename) {
  console.log('文件名不能为空！');
  console.log('示例：npm run temp test Demo');
  process.exit(0);
}

// 页面模版
const template = `<template>
  <div>
    hello,landing guy!
  </div>
</template>
<script>
  import url from '@/api/url';
  import {post, get} from "@/api/ax";

  export default {
    name: '${filename}',
    components: {},
    data() {
      return {}
    },
    methods: {},
    computed: {},
    mounted() {}
  }
</script>`;

const dir = `./src/components/index/`;
fs.mkdirSync(`${dir}${dirName}`);// mkdir $1
process.chdir(`${dir}${dirName}`); // cd $1
fs.writeFileSync(filename + '.vue', template);

console.log(`>>>>>>组件${filename}已创建<<<<<<`);
process.exit(0);
