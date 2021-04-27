import {$del, get, post} from "./ax"

const url = {
  addGoodsType: '/goods/type/add',
  getGoodsType: '/goods/type',
  saveGoods: '/goods/save',
  getGoods: '/goods',
  deleteGoods: '/goods/',
};


export default {
  addGoodsType: (params) => post(url.addGoodsType, params),
  getGoodsType: () => get(url.getGoodsType),
  saveGoods: (params) => post(url.saveGoods, params),
  getGoods: (params) => post(url.getGoods, params),
  deleteGoods: (id) => $del(url.deleteGoods + id),
}
