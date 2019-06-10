export default {
  base: "",
  //登录
  login: "/api/uaa/oauth/token",
  logout: "/api/uaa/logout",

  //学校管理
  addSchool: '/api/management/school',
  getSchool: '/api/management/school',

  //年级管理
  addGrade: '/api/management/grade',
  updateGrade: '/api/management/grade',
  getGrade: '/api/management/grade',
  getGradesByStageId: '/api/management/grade/stage/',
  getClazzByGradeId: '/api/management/clazz/grade/',
  getClazzByStageId: '/api/management/clazz/stage/',

  //班级管理
  addClazz: '/api/management/clazz',
  updateClazz: '/api/management/clazz',
  getClazz: '/api/management/clazz',

  //上传图片
  uploadImg: '/image/upload',

  //账号管理
  addAccount: '/api/management/user',
  getStudents: '/api/management/student',
  updateStudent: '/api/management/student',
  getTeachers: '/api/management/teacher',
  updateTeacher: '/api/management/teacher',
  resetPassword: '/api/management/user/password',
  importStudent: '/api/management/file/student',
  importTeacher: '/api/management/file/teacher',

  getSubjectByStageId: '/api/basic/subjects/stage/',

  //分析管理
  teacherAnalysis: '/api/management/stat/teacher',
  gradeAnalysis: '/api/management/stat/grade',
  clazzAnalysis: '/api/management/stat/clazz',
  subjectAnalysis: '/api/management/stat/subject',
  studentAnalysis: '/api/management/stat/student',

  //总览页面
  overview: '/api/management/stat/overview',
  overviewDetail: '/api/management/stat/details',
  overviewClassDetail: '/api/management/stat/details/class',
  overviewTeacher: '/api/management/stat/class_teacher',

  //导出excel
  downloadDetails: '/api/management/stat/file/details',
  downloadClassDetails: '/api/management/stat/file/details/class',
  downloadTeacher: '/api/management/stat/file/class_teacher',

  //年份信息
  year: '/api/basic/exam_papers/year',
  //年级信息
  grade: '/api/basic/exam_papers/grade',
  //省份信息
  province: '/api/basic/exam_papers/province',
  //类型信息
  type: '/api/basic/exam_papers/type',
  //试卷信息
  examPapers: '/api/basic/exam_papers',

};
