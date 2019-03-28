export default {
  base: "",
  //登录
  login: "login",
  logout: "logout",

  //学校管理
  addSchool: '/api/management/school',
  getSchool: '/api/management/school',

  //账号管理
  addAccount: '/api/management/user',
  getStudents: '/api/management/student',
  updateStudent: '/api/management/student',
  getTeachers: '/api/management/teacher',
  updateTeacher: '/api/management/teacher',
  resetPassword: '/api/management/user/password',

  getSubjectByStageId: '/api/basic/subjects/stage/',


  //总览页面
  overview: '/api/management/stat/overview',


};
