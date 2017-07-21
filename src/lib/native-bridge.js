/**
 * Created by lichuanjing on 2017/6/1.
 */
/* eslint-disable */
var regNativeMap = {}
import Promise from './promise'
function setupWebViewJavascriptBridge (callback) {

  //Android使用
  if (window.WebViewJavascriptBridge) {
    callback(WebViewJavascriptBridge)
  } else {
    document.addEventListener(
      'WebViewJavascriptBridgeReady'
      , function () {
        callback(WebViewJavascriptBridge)
      },
      false
    );
  }
  //IOS
  if (window.WebViewJavascriptBridge) {
    return callback(WebViewJavascriptBridge)
  }
  if (window.WVJBCallbacks) {
    return window.WVJBCallbacks.push(callback)
  }
  window.WVJBCallbacks = [callback];
  var WVJBIframe = document.createElement('iframe')
  WVJBIframe.style.display = 'block';
  WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__'
  document.documentElement.appendChild(WVJBIframe)
  setTimeout(function () {
    document.documentElement.removeChild(WVJBIframe)
  }, 0)
}
var regNative = function (fName, fn) {
  var _fnInstance = regNativeMap[fName]
  if (_fnInstance) {
    console.error('The fName' + fName + 'has been register!!!')
    return
  } else {
    regNativeMap[fName] = fn
    // 需要改动，目前returns只支持promise返回值
    setupWebViewJavascriptBridge(function (bridge) {
      bridge.registerHandler(fName, function (data, responseCallback) {
        var res = data && JSON.parse(JSON.stringify(data))
        var returns = regNativeMap[fName](res)
        returns.then(function (cbData) {
          return responseCallback(cbData)
        })
        // }
      })
    })
  }
}
var nativeBridge = null
setupWebViewJavascriptBridge(function (bridge) {
  nativeBridge = bridge
})
var unRegNative = function (fName) {
  delete regNativeMap[fName]
}
var callNative = function (funcName, data, func) {
  if (!nativeBridge) return Promise.as(new Error('No Native Bridge!'))
  return new Promise(function (resolve, reject) {
    nativeBridge.callHandler(funcName, data, function responseCallback (resData) {
      if (!resData) {
        resData = {errcode: 9999, errdesc: 'call error !'}
      } else {
        resData = JSON.parse(JSON.stringify(resData))
        resData.errcode || (resData.errcode = 0)
      }
      resolve(resData)
    })
  })
}
export {regNative, unRegNative, callNative}