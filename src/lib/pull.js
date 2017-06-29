/**
 * Created by lichuanjing on 2017/6/1.
 */
/* eslint-disable */
const apiList = {
  direct: {url: '/api/direct'},
  signIn: {url: '/api/system/signin'},
  signOff: {url: '/api/system/signoff'},
  queryProductSort: {url: '/api/product/queryProductSort'},
  mobileHome: {url: '/api/mobileHome'},
  mobileHotPage: {url: '/api/mobileHotPage'},
  mobileSortProds: {url: '/api/mobileSortProds'},
  queryProdInfo: {url: '/api/product/queryProdInfo'},
  queryProdsByType: {url: '/api/business/queryProdsByType'},
  billMainInfo: {url: '/api/business/billMainInfo'},
  upsertBillMain: {url: '/api/business/upsertBillMain'},
  getConfigure: {url: '/api/support/getConfigure'},
  queryCustCompany: {url: '/api/crm/queryCustCompany'},
  updateCustCompany: {url: '/api/crm/updateCustCompany'},
  queryCustBank: {url2: '/api/crm/queryCustBank'},
  queryPiProd: {url: '/api/business/queryPiProd'},
  updatePiProd: {url: '/api/business/updatePiProd'},
  getMgbField: {url: '/api/support/getMgbField'}
}
const nativeList = {
  goNegotiateVC: {url: '/native/goNegotiateVC'}
}
import {request} from './request'
var pull = {}
pull.init = function (arr) {
  let pullAll = arr
  let pullMap = {}
  Object.keys(pullAll).forEach(function (key) {
    let item = pullAll[key]
    let req = request
    let url = item.url || item.url2
    let func = function (data) {
      return req(url, data)
    }
    pullMap[key] = func
  })
  return pullMap
}

export default pull
