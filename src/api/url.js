export default {
  base: "",
  //登录
  login: "login",
  logout: "logout",

  //账号管理
  addAccount: 'addAccount',
  getAccount: 'getAccount',
  deleteAccount: 'deleteAccount',
  updatePwd: 'updatePwd',
  updatePassword: 'updatePassword',

  //班级管理
  saveClass: 'class/save',
  getClass: 'class/get',
  getClassStudent: 'class/student/get/',
  saveStudent: 'class/student/save',
  deleteStudent: 'class/student/delete/',
  applyClass: 'class/apply',

  //题库管理
  getExamination: 'examination/get',
  saveExamination: 'examination/save',
  deleteExamination: 'examination/delete/',

  //试卷管理
  getPaper: 'paper/get',
  getPaperById: 'paper/get/',
  savePaper: 'paper/save',
  publishPaper: 'paper/publish',
  publishRecord: 'paper/publish/record',

  //答题记录
  getReply: 'reply/get',
  saveReply: 'reply/save',
  analysisReply: 'reply/analysis/',

  //备份恢复数据
  backup: 'backup',
  restore: 'restore'
};
