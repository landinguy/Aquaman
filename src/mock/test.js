const Mock = require("mockjs");

Mock.mock("/test", "post", {msg: '', code: 0, data: "jack"});

Mock.mock("/api/management/getSchool", "post", {
  msg: '', code: 0,
  data: {
    name: '北京大学',
    englishName: 'Peking University',
    motto: '勤奋、严谨、求实、创新',
    address: '北京市海淀区颐和园路5号',
    website: 'http://www.pku.edu.cn',
    badge: 'https://gss0.bdstatic.com/-4o3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike150%2C5%2C5%2C150%2C50/sign=ea9f882693510fb36c147fc5b85aa3f0/b21bb051f81986183a28291b47ed2e738ad4e6c6.jpg',
    description: '北京大学（Peking University），简称“北大”，由中华人民共和国教育部直属，中央直管副部级建制，位列“211工程”、“985工程”、“世界一流大学和一流学科”，入选“基础学科拔尖学生培养试验计划”、“高等学校创新能力提升计划”、“高等学校学科创新引智计划”，为九校联盟、中国大学校长联谊会、京港大学联盟、亚洲大学联盟、东亚研究型大学协会、国际研究型大学联盟、环太平洋大学联盟、东亚四大学论坛、国际公立大学论坛、中俄综合性大学联盟成员。',
  }
});











