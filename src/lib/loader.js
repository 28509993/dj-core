/**
 * Created by lichuanjing on 2017/6/13.
 */
import Promise from './promise'
import Eventer from './eventer'
import { xhrRequest } from './request'
function merge(a, b) {
  if (!a || !b) return a
  Object.keys(b).forEach(function(k) {
    a[k] = b[k]
  })
  return a
}
function fileType(str) {
  var matchs = str.match(/\.(\w+)($|\?)/) || []
  var ext = matchs[1] || 'unknown'
  return ext
}

function getHeadDom (){
  var heads = document.getElementsByTagName('head')
  return heads && heads[0]
}

function defineJs(urlObj) {
  var script = document.createElement('script')
  script.type = 'text/javascript'
  try {
    script.appendChild(document.createTextNode(urlObj.xhr.responseText))
  } catch (e) {
    script.text = urlObj.xhr.responseText
  }
  delete urlObj.xhr
  getHeadDom().appendChild(script)
  urlObj.injected = true
}
function defineCss(urlObj) {
  var style = document.createElement('style')
  style.type = 'text/css'
  try {
    style.appendChild(document.createTextNode(urlObj.xhr.responseText))
  } catch (e) {
    style.styleSheet.cssText = urlObj.xhr.responseText
  }
  delete urlObj.xhr
  getHeadDom().appendChild(style)
  urlObj.injected = true
}
function attachImg(urlObj) {
  var img = this.element
  if (typeof img === 'string') {
    img = document.querySelector(img)
  }
  if (!(img instanceof window.HTMLImageElement)) {
    img = new window.Image()
  }
  img.onload = function(e) {
    window.URL.revokeObjectURL(img.src)
  }
  img.src = window.URL.createObjectURL(urlObj.xhr.response)
  urlObj.injected = true
}
function ResContext(urls, element) {
  var self = this
  Eventer.call(this)
  urls = urls || []
  Array.isArray(urls) || (urls = [urls])
  this.urls = []
  this.completeIndex = -1
  this.isError = false
  this.element = element
  urls.forEach(function(url) {
    var type = fileType(url)
    var typeObj = {}
    if (type === 'js') {
      typeObj['isJs'] = true
    } else if (type === 'css') {
      typeObj['isCss'] = true
    } else if (/jp[e]?g|png/.test(type)) {
      typeObj['isImg'] = true
    }
    var urlObj = merge(
      {
        type: type,
        url: url,
        loading: false,
        loaded: false,
        injected: false,
        text: ''
      },
      typeObj
    )
    self.urls.push(urlObj)
  })
  this.on('next', onNext.bind(this))
  this.on('complete', onComplete.bind(this))
}
ResContext.prototype = Eventer.prototype
function onComplete() {
  this._onComplete && this._onComplete()
}
var loadTotal = 0
function tryLoad(urlObj) {
  loadTotal ++
  if (loadTotal>30) {
    //window.location.reload();
    return ;
  }
  var self = this
  var p
  var opts = { method: 'GET' }
  urlObj.isImg && (opts['responseType'] = 'blob')
  p = xhrRequest(urlObj.url, null, opts)
  p.then(
    function(xhr) {
      var redo =false
      //剔除注入数据
      if (urlObj.isJs) {
        var jstext = xhr.responseText || ''
        if (jstext.length <4096 && xhr.responseText.indexOf(urlObj.url)>=0){
          redo = true;
        }
      }
      if (redo) {
        if (!/\?/.test(urlObj.url)) {
          urlObj.url = urlObj.url+"?"
        }
        urlObj.url = urlObj.url + "vz=" + (Math.random()+'').substr(5,1)
        tryLoad.call(self,urlObj)
      } else {
        urlObj['xhr'] = xhr
        urlObj.loading = true
        self.emit('next')
      }
    },
    function(e) {
      console.log('load js error,',e)
      tryLoad.call(self,urlObj)
    }
  )
}
function onNext() {
  var self = this
  if (!getHeadDom()) {
    setTimeout(function(){
      self.emit('next')
    }, 50)
    return ;
  }
  var curIndex = this.completeIndex + 1
  var urlObj = this.urls[curIndex]
  if (!urlObj || urlObj.loaded || urlObj.injected || !urlObj.xhr) return
  urlObj.loaded = true
  var fn
  urlObj.isJs && (fn = defineJs)
  urlObj.isCss && (fn = defineCss)
  urlObj.isImg && (fn = attachImg)
  fn.call(this, urlObj)
  this.completeIndex = curIndex
  if (curIndex === this.urls.length - 1) {
    this.emit('complete')
  } else {
    this.emit('next')
  }
}
function loadContext() {
  var self = this
  self.urls.forEach(function(urlObj) {
    tryLoad.call(self, urlObj)
  })
}
function docReady() {
  if (document.readyState === 'complete') {
    return Promise.as()
  }
  return new Promise(function(resolve, reject) {
    if (document.all) {
      document.onreadystatechange = function() {
        if (
          document.readyState === 'loaded' || document.readyState === 'complete'
        ) {
          resolve()
        }
      }
    } else {
      document.addEventListener(
        'DOMContentLoaded',
        function() {
          resolve()
        },
        false
      )
    }
  })
}

// var clearMbInjectTime = 2
// function clearMbInject() {
//   clearMbInjectTime --;
//   if (clearMbInjectTime<=0) return;
//   var nodes =document.body.children ||document.body.childNodes||[];
//   if (nodes.length<=1) return ;
//   for (var i = 0; i < nodes.length; i++) {
//     var node = nodes[i]
//     if (/div|span|iframe/i.test(node.tagName) && i>0) {
//       if (node.getAttribute("data-dj")||node.getAttribute("id")==='app'){
//
//       } else {
//         console.log('---nima--' + node.getAttribute("id"))
//         node.style && (node.style.display='none');
//       }
//     }
//   }
//   setTimeout(clearMbInject,3000)
// }

function loadInjection(urls, element) {
  Array.isArray(urls) || (urls = [urls])
  return docReady().then(function() {
    return new Promise(function(resolve, reject) {
      var res = new ResContext(urls, element)
      if (!urls || !urls.length) return resolve()
      res._onComplete = function() {
        resolve()
      }
      res._onFail = function() {
        reject()
      }
      setTimeout(function() {
        loadContext.call(res)
      })
    })
  })
}
export { loadInjection }
