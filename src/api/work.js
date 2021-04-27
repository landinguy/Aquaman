import {post} from "./ax"

const url = {
  saveWorkRecord: '/workRecord/save',
  savePurchaseDetail: '/purchaseDetail/save',
  saveStorageDetail: '/storageDetail/save',
  saveSaleDetail: '/saleDetail/save',
  getPurchaseDetail: '/purchaseDetail',
  getStorageDetail: '/saleDetail',
  getSaleDetail: '/saleDetail',

};


export default {
  saveWorkRecord: (params) => post(url.saveWorkRecord, params),
  savePurchaseDetail: (params) => post(url.savePurchaseDetail, params),
  saveStorageDetail: (params) => post(url.saveStorageDetail, params),
  saveSaleDetail: (params) => post(url.saveSaleDetail, params),
  getPurchaseDetail: (params) => post(url.getPurchaseDetail, params),
  getStorageDetail: (params) => post(url.getStorageDetail, params),
  getSaleDetail: (params) => post(url.getSaleDetail, params),
}
