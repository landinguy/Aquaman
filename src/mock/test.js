const Mock = require("mockjs");
const templateData = [
  {"id": "1", "name": "模板1", "status": "审核通过",},
  {"id": "2", "name": "模板2", "status": "审核中",},
  {"id": "3", "name": "模板3", "status": "审核失败",},
  {"id": "4", "name": "模板4", "status": "已失效",},
];
Mock.mock("/tmpls", "post", {msg: '', code: 0, data: templateData});











