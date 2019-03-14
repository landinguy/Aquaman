export default {
  base: "",
  //登录
  login: "/api/uaa/oauth/token",
  logout: "/api/uaa/logout",

  //学校管理
  addSchool: '/api/management/school',
  getSchool: '/api/management/getSchool',

  //年级管理
  addGrade: '/api/management/grade',
  getGradesByStageId: '/api/management/grade/stage/',
  getClazzByGradeId: '/api/management/clazz/grade/',
  getClazzByStageId: '/api/management/clazz/stage/',

  //班级管理
  addClazz: '/api/management/clazz',

  //上传图片
  uploadImg: '/image/upload',

  //账号管理
  addAccount: '/api/management/user',
  getAccountCount: '',
  getAccounts: '',

  getSubjectByStageId: '/api/basic/subjects/stage/',

  //分析管理
  teacherAnalysis: '/api/management/stat/teacher',
  gradeAnalysis: '/api/management/stat/grade',
  clazzAnalysis: '/api/management/stat/clazz',
  subjectAnalysis: '/api/management/stat/subject',

  //总览页面
  overview: '/api/management/stat/overview',


};
