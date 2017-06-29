/**
 * Created by lichuanjing on 2017/6/1.
 */
/* eslint-disable */
import getQuerystring from './getQuerystring'
import Promise from './promise'
import {isObject, dateConvert, toJSON} from './utils'
var webBridge
function getType (value) {
  return Object.prototype.toString.call(value)
}
function overrideReq (url, data, opts) {
  opts = opts || {}
  if (getType(data) === '[object Object]') {
    data = eliminateX(JSON.parse(JSON.stringify(data)))
  }
  if (data) {
    let newUrl = getQuerystring(url, data)
    if (newUrl) {
      url = newUrl
      data = null
    } else {
      data = JSON.stringify(data)
    }
  }
  if (data) {
    opts.method = 'POST'
  } else {
    opts.method = 'GET'
  }
  if (isObject(data)) {
    var newUrl = getQuerystring(url, data)
    if (newUrl) {
      url = newUrl
      data = null
    } else {
      data = JSON.stringify(data)
    }
  }
  return {url: url, data: data, opts: opts}
}
function xhrRequest (url, data, opts) {
  var overObj = overrideReq(url, data, opts)
  url = overObj.url
  data = overObj.data
  opts = overObj.opts
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest()
    opts.responseType && (xhr.responseType = opts.responseType)
    try {
      var isComplete = false
      xhr.onreadystatechange = function (e) {
        if (xhr.readyState === 4) {
          if (xhr.status >= 200 && xhr.status <= 304) {
            isComplete || resolve(xhr)
          } else {
            console.log(xhr.status, url)
            isComplete || reject(new Error(xhr))
          }
          isComplete = true
        }
      }
      var errHandler = function () {
        reject(new Error('http error!'))
      }
      var timeoutHandler = function () {
        resolve('Http Request is timeout, please try again.')
        isComplete = true
      }
      xhr.onload = function () {
      }
      xhr.onabort = errHandler
      xhr.onerror = errHandler
      xhr.ontimeout = errHandler
      xhr.open(opts.method, url, true)
      // xhr.setRequestHeader('Access-Control-Allow-Headers', 'Origin,Content-Type,Accept')
      // xhr.setRequestHeader('X-Request-With', null)
      if (opts.method === 'POST') {
        xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8')
      }
      xhr.send(data)
    } catch (e) {
      reject(e)
    }
  })
}
function eliminateX (data) {
  if (Array.isArray(data)) {
    data.forEach(function (item) {
      eliminateX(item)
    })
    return data
  }
  if (!isObject(data)) return data
  Object.keys(data).forEach(function (key) {
    if (/^x_/i.test(key)) {
      delete data[key]
    } else {
      if (Array.isArray(data[key])) {
        eliminateX(data[key])
      } else if (isObject(data[key])) {
        var child = eliminateX(data[key])
        Object.keys(child).length || (delete data[key])
      }
    }
  })
  return data
}
function mobileRequest (url, data = {}) {
  console.log('get in mobile')
  if (!webBridge) return Promise.as(new Error('no web bridge!!'))
  return new Promise(function (resolve, reject) {
    data['fname'] = url
    webBridge.callHandler('mobileBridge', data, function responseCallback (v) {
      if (v && isObject(v)) {
        v = JSON.parse(JSON.stringify(v))
        v.errcode || (v.errcode = 0)
      } else {
        v = {errcode: 9999, errdesc: 'call error !'}
      }
      resolve({data: v, headers: {'content-type': 'application/json'}})
    })
  })
}
function request (url, data) {
  var p
  if (isObject(data)) {
    data = eliminateX(JSON.parse(JSON.stringify(data)))
  }
  var isNative = /^\/native\//.test(url)
  if (isNative) {
    p = mobileRequest(url, data || {})
  } else {
    p = xhrRequest(url, data).then(function (xhr) {
      var type = xhr.getResponseHeader('content-type')
      var val = xhr.responseText
      if (/json/.test(type)) {
        val = toJSON(val)
      }
      return val
    })
  }
  p = p.then(function (data) {
    try {
      if (!isObject(data)) return data
      dateConvert(data)
      if (data.errcode === 0) {
        return data
      } else {
        console.error(url, {errcode: data.errcode, message: data.message}, data.errstack || '')
        return Promise.as(new Error(data.errdesc || 'error'))
      }
    } catch (e) {
      if (e.errstack) {
        console.error(url, e.errstack)
      } else {
        console.error(url, e)
      }
      return Promise.as(new Error(data.errdesc || 'error'))
    }
  })
  return p
}
export {request, xhrRequest}