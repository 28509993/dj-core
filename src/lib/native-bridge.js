/**
 * Created by lichuanjing on 2017/6/1.
 */
/* eslint-disable */
var regNativeMap = {}
import Promise from './promise'

function setupWebViewJavascriptBridge (callback) {
  if (window.WebViewJavascriptBridge) {
    return callback(window.WebViewJavascriptBridge)
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
        if (typeof data === 'string') {
          console.log('receive from android:string:' + data)
        } else {
          console.log('receive from android:object:' + JSON.stringify(data))
        }
        var res = data
        if (data) {
          data = typeof data === 'string' ? data : JSON.stringify(data)
          res = JSON.parse(data)
        }
        var returns = regNativeMap[fName](res)
        if (!(returns instanceof Promise )) {
          returns = Promise.as(returns)
        }
        returns.then(function (cbData) {
          return responseCallback && responseCallback(cbData)
        })
      })
    })
  }
}
var nativeBridge = null
if (/iPhone|Android/i.test(window.navigator.userAgent)){
  setupWebViewJavascriptBridge(function (bridge) {
    nativeBridge = bridge
    console.log('nativeBridge nativeBridge=true')
    setTimeout(function () {
      initChannel()
    }, 0)
  })
}

var unRegNative = function (fName) {
  delete regNativeMap[fName]
}

var callNative = function (funcName, data) {
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
//{type:WV_BUTTON_L01,.....}
//type:WV_BUTTON_BACK WV_BUTTON_L01,WV_BUTTON_R01,WV_SEARCH_01
var dangjia = window.dangjia
function initChannel () {
  if (!nativeBridge) return;
  regNative('/webview/message', function (data) {
    if (!data||!data.type) return;
    //dangjia.emit('webview', data.type, data.message)
    dangjia.emit(data.type, data.message)
  })
}
//type:"WV_TOOLBAR_SETTING"
//message:{bar_type:"normal","search_hint":"hint",title:'xxx',buttons:[{type:'WV_BUTTON_L01',visible:'1',color:'d',icon:'333',intercept:'1'}]}
//bar_type: none,normal,search
//search_hint: 当bar_type为search的提示

//type:"WV_OPEN_PAGE" {url:"/dfd/d"}
//type:"WV_PICTURE" {url:"/dfd/d"}


function callWebview (type,message) {
  var data ={type:type,message:message ||{}}
  return callNative('/native/webview/message', data)
}

function openWebview (url) {
  return callWebview("WV_OPEN_PAGE",{url:url})
}

export {regNative, unRegNative, callNative, callWebview,openWebview}