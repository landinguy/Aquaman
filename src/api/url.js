export default {
  base: "",
  //登录
  login: "/api/uaa/oauth/token",
  logout: "/api/uaa/logout",
  //首页
  homeTotal: "/sm/index/total/",
  homeTrend: "/sm/index/trend/",
  home: "/sm/index/",
  //账户
  getAdmininfo: "/sm/account/get/",
  updateAdminNickname: "/sm/account/info/base/update",
  updateAdminPassword: "/sm/account/pwd/update",
  updateAdminProperty: "/sm/account/info/property/update",
  //子账户
  subAccountList: "/sm/subaccount/list/",
  disableOrDeleteSubAccount: "/sm/subaccount/status/modify",
  addSubAccount: "/sm/subaccount/info/insert",
  modifySubAccount: "/sm/subaccount/info/update",
  addGroup: "/sm/account/relate",
  queryRelate: "/sm/account/relate/query",
  resetApiSecret: "/sm/subaccount/resetApiSecret",
  test: "/test",

  //学校管理
  addSchool: '/api/management/school',

  //上传图片
  uploadImg: '/image/upload'

};
