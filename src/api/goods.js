import {get, post} from "./ax"

const url = {
  addGoodsType: '/goods/type/add',
  getGoodsType: '/goods/type',
  addGoods: '/goods/add',
  getGoods: '/goods',
};


export default {
  addGoodsType: (params) => post(url.addGoodsType, params),
  getGoodsType: () => get(url.getGoodsType),
  addGoods: (params) => post(url.addGoods, params),
  getGoods: (params) => post(url.getGoods, params),
}
