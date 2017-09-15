/**
 * Created by lichuanjing on 2017/6/1.
 */
/* eslint-disable */
import nativePromise from 'Promise'
import PromisePolifill from './promise-polyfill'

var Promise = nativePromise
var isSupported = Promise &&
  'resolve' in Promise &&
  'reject' in Promise &&
  'all' in Promise &&
  'race' in Promise && (function () {
    var resolve;
    new Promise(function (r) {
      resolve = r;
    });
    return typeof resolve === 'function';
  })();

if (!isSupported){
  Promise = PromisePolifill;
  window['Promise'] = Promise
}


Promise.as = Promise.prototype.as = function (value) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      if (value instanceof Error) {
        reject(value)
      } else {
        resolve(value)
      }
    })
  })
}
function PromiseWrap(args) {
  this.args = args
}
PromiseWrap.prototype.then = function (resolve1, reject1) {
  var self = this
  return new Promise(function (resolve, reject) {
    Promise.all(self.args).then(function (values) {
      try {
        resolve(resolve1.apply(null, values))
      } catch (err1) {
        reject1 && reject1(err1)
        reject(err1)
      }
    }, function (err) {
      reject1 && reject1(err)
      reject(err)
    })
  })
}
Promise.when = Promise.prototype.when = function (queue) {
  var args = Array.isArray(queue) ? queue : Array.prototype.slice.call(arguments)
  return new PromiseWrap(args)
}
Promise.wrap = function (fn) {
  return function () {
    var args = Array.prototype.slice.call(arguments)
    var ctx = this
    var p = new Promise(function (resolve, reject) {
      var cb = function (err) {
        var results = Array.prototype.slice.call(arguments)
        results = results.slice(1, results.length)
        if (err) return reject(err)
        resolve.call(ctx, results.length <= 1 ? results[0] : results)
      }
      args.push(cb)
      fn.apply(ctx, args)
    })
    return p
  }
}
Promise.waterfall = Promise.prototype.waterfall = function (ps, noIgnore) {
  // noIgnore 如果为false表示要忽略其中的错误,继续执行
  var self = this
  var results = []
  var n = 0
  ps = Array.isArray(ps) ? ps : [ps]
  if (ps.length <= 0) return Promise.as()
  return new Promise(function (resolve, reject) {
    function step(v) {
      var fn = ps[n]
      var p = fn.call(self, v)
      p.then(function (v) {
        results.push(v)
        n++
        if (n < ps.length) {
          step(v)
        } else {
          resolve(results)
        }
      }, function (err) {
        if (!noIgnore) return reject(err)
        // 忽略错误继续执行
        results.push(err)
        n++
        if (n < ps.length) {
          step(v)
        } else {
          resolve(results)
        }
      })
    }

    step()
  })
}
export default Promise