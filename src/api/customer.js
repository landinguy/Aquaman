import {get, post} from "./ax"

const url = {
  queryById: '/customer/',
  save: '/customer/add',
};


export default {
  queryById: (userId) => get(url.queryById + userId, null),
  save: (params) => post(url.save, params)
}
