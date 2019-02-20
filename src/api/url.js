export default {
  base: "",
  //登录
  login: "/api/uaa/oauth/token",
  logout: "/api/uaa/logout",
  //首页
  homeTotal: "/sm/index/total/",
  homeTrend: "/sm/index/trend/",
  home: "/sm/index/",

  //学校管理
  addSchool: '/api/management/school',

  //年级管理
  addGrade: '/api/management/grade',
  getGradesByStageId: '/api/management/grade/stage/',

  //班级管理
  addClazz: '/api/management/clazz',


  //上传图片
  uploadImg: '/image/upload'

};
