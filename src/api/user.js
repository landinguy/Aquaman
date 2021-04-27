import {$get, get, post} from "./ax"

const url = {
  login: "login",
  logout: "logout",
  register: "/user/register",
  getUser: '/user',
  saveUser: '/user/save',
  getById: '/user/'

};


export default {
  login: (params) => $get(url.login, params),
  logout: () => get(url.logout),
  register: (params) => post(url.register, params),
  getUser: (params) => post(url.getUser, params),
  saveUser: (params) => post(url.saveUser, params),
  getById: (id) => get(url.getById + id),
}
