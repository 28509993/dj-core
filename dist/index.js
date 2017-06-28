/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Promise = __webpack_require__(7);

var _Promise2 = _interopRequireDefault(_Promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_Promise2.default.as = _Promise2.default.prototype.as = function (value) {
  return new _Promise2.default(function (resolve, reject) {
    setTimeout(function () {
      if (value instanceof Error) {
        reject(value);
      } else {
        resolve(value);
      }
    });
  });
}; /**
    * Created by lichuanjing on 2017/6/1.
    */
/* eslint-disable */

function PromiseWrap(args) {
  this.args = args;
}
PromiseWrap.prototype.then = function (resolve1, reject1) {
  var self = this;
  return new _Promise2.default(function (resolve, reject) {
    _Promise2.default.all(self.args).then(function (values) {
      try {
        resolve(resolve1.apply(null, values));
      } catch (err1) {
        reject1 && reject1(err1);
        reject(err1);
      }
    }, function (err) {
      reject1 && reject1(err);
      reject(err);
    });
  });
};
_Promise2.default.when = _Promise2.default.prototype.when = function (queue) {
  var args = Array.isArray(queue) ? queue : Array.prototype.slice.call(arguments);
  return new PromiseWrap(args);
};
_Promise2.default.wrap = function (fn) {
  return function () {
    var args = Array.prototype.slice.call(arguments);
    var ctx = this;
    var p = new _Promise2.default(function (resolve, reject) {
      var cb = function cb(err) {
        var results = Array.prototype.slice.call(arguments);
        results = results.slice(1, results.length);
        if (err) return reject(err);
        resolve.call(ctx, results.length <= 1 ? results[0] : results);
      };
      args.push(cb);
      fn.apply(ctx, args);
    });
    return p;
  };
};
_Promise2.default.waterfall = _Promise2.default.prototype.waterfall = function (ps, noIgnore) {
  // noIgnore 如果为false表示要忽略其中的错误,继续执行
  var self = this;
  var results = [];
  var n = 0;
  ps = Array.isArray(ps) ? ps : [ps];
  if (ps.length <= 0) return _Promise2.default.as();
  return new _Promise2.default(function (resolve, reject) {
    function step(v) {
      var fn = ps[n];
      var p = fn.call(self, v);
      p.then(function (v) {
        results.push(v);
        n++;
        if (n < ps.length) {
          step(v);
        } else {
          resolve(results);
        }
      }, function (err) {
        if (!noIgnore) return reject(err);
        // 忽略错误继续执行
        results.push(err);
        n++;
        if (n < ps.length) {
          step(v);
        } else {
          resolve(results);
        }
      });
    }

    step();
  });
};
exports.default = _Promise2.default;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Created by lichuanjing on 2017/6/1.
 */
/* eslint-disable */
function isObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}
function dateConvert(v) {
  if (isObject(v)) {
    return v;
  }
  Object.keys(v).forEach(function (key) {
    var value = v[key];
    if (/_date$/i.test(key) && typeof value === 'string') {
      try {
        var dt = new Date(value);
        v[key] = dt;
      } catch (err) {}
    } else if (isObject(value)) {
      dateConvert(value);
    } else if (Array.isArray(value)) {
      value.forEach(function (vv) {
        dateConvert(vv);
      });
    }
  });
  return v;
}
function toJSON(v) {
  try {
    return JSON.parse(v);
  } catch (e) {
    return v;
  }
}
function getType(value) {
  return Object.prototype.toString.call(value);
}
function stringifyPrimitive(v) {
  if (Object.prototype.toString.call(v) === '[object Date]') {
    return v.toISOString();
  }
  switch (typeof v === 'undefined' ? 'undefined' : _typeof(v)) {
    case 'string':
      return v;
    case 'boolean':
      return v ? 'true' : 'false';
    case 'number':
      return isFinite(v) ? v : '';
    default:
      return '';
  }
}
function querystring(obj) {
  var sep = '&';
  var eq = '=';
  if (obj === null) {
    obj = undefined;
  }
  return Object.keys(obj).map(function (k) {
    var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
    if (Array.isArray(obj[k])) {
      return obj[k].map(function (v) {
        return ks + encodeURIComponent(stringifyPrimitive(v));
      }).join(sep);
    } else {
      return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
    }
  }).join(sep);
}
function getParamByUrl(url, name) {
  var reg = new RegExp('(^|\\?|&)' + name + '=([^&]*)(\\s|&|$)', 'i');
  if (reg.test(url)) {
    return unescape(RegExp.$2.replace(/\+/g, ' '));
  }
  return '';
}
exports.isObject = isObject;
exports.dateConvert = dateConvert;
exports.getType = getType;
exports.toJSON = toJSON;
exports.stringifyPrimitive = stringifyPrimitive;
exports.querystring = querystring;
exports.getParamByUrl = getParamByUrl;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Created by lichuanjing on 2017/6/1.
 */
/* eslint-disable */
function Eventer() {
  Eventer.init.call(this);
}
Eventer.init = function () {
  if (!this._events || this._events === Object.getPrototypeOf(this)._events) {
    this._events = {};
  }
};
Eventer.prototype.addListener = function addListener(type, listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('listener must be a function');
  }
  var events = this._events;
  var existing;
  if (!events) {
    events = this._events = {};
  } else {
    existing = events[type];
  }
  if (!existing) {
    existing = events[type] = listener;
  } else {
    if (typeof existing === 'function') {
      existing = events[type] = [existing, listener];
    } else {
      existing.push(listener);
    }
  }
  return this;
};
Eventer.prototype.emit = function emit(type) {
  var handler, events;
  var self = this;
  events = self._events || {};
  handler = events[type];
  var args = Array.prototype.slice.call(arguments).splice(1);
  if (!handler) return false;
  setTimeout(function () {
    if (typeof handler === 'function') {
      handler.apply(self, args);
    } else {
      var i = handler.length;
      var arr = new Array(i);
      while (i--) {
        arr[i] = handler[i];
      }
      arr.forEach(function (fn) {
        fn.apply(self, args);
      });
    }
  }, 1);
  return true;
};
Eventer.prototype.removeListener = function removeListener(type, listener) {
  var events = this._events;
  if (!type || typeof listener !== 'function') return this;
  var list = events[type];
  if (!list) return this;
  if (listener === list) {
    delete events[type];
    return this;
  }
  if (Array.isArray(list)) {
    for (var i = 0; i < list.length; i++) {
      var handler = list[i];
      if (handler === listener) {
        list.splice(i, 1);
        break;
      }
    }
    if (!list.length) delete events[type];
  }
  return this;
};
Eventer.prototype.on = Eventer.prototype.addListener;
Eventer.prototype.remove = Eventer.prototype.removeListener;
exports.default = Eventer;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.xhrRequest = exports.request = undefined;

var _getQuerystring = __webpack_require__(4);

var _getQuerystring2 = _interopRequireDefault(_getQuerystring);

var _promise = __webpack_require__(0);

var _promise2 = _interopRequireDefault(_promise);

var _utils = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var webBridge; /**
                * Created by lichuanjing on 2017/6/1.
                */
/* eslint-disable */

function getType(value) {
  return Object.prototype.toString.call(value);
}
function overrideReq(url, data, opts) {
  opts = opts || {};
  if (getType(data) === '[object Object]') {
    data = eliminateX(JSON.parse(JSON.stringify(data)));
  }
  if (data) {
    var _newUrl = (0, _getQuerystring2.default)(url, data);
    if (_newUrl) {
      url = _newUrl;
      data = null;
    } else {
      data = JSON.stringify(data);
    }
  }
  if (data) {
    opts.method = 'POST';
  } else {
    opts.method = 'GET';
  }
  if ((0, _utils.isObject)(data)) {
    var newUrl = (0, _getQuerystring2.default)(url, data);
    if (newUrl) {
      url = newUrl;
      data = null;
    } else {
      data = JSON.stringify(data);
    }
  }
  return { url: url, data: data, opts: opts };
}
function xhrRequest(url, data, opts) {
  var overObj = overrideReq(url, data, opts);
  url = overObj.url;
  data = overObj.data;
  opts = overObj.opts;
  return new _promise2.default(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    opts.responseType && (xhr.responseType = opts.responseType);
    try {
      var isComplete = false;
      xhr.onreadystatechange = function (e) {
        if (xhr.readyState === 4) {
          if (xhr.status === 200 || xhr.status === 304) {
            isComplete || resolve(xhr);
          } else {
            console.log(xhr.status, url);
            isComplete || reject(new Error(xhr));
          }
          isComplete = true;
        }
      };
      var errHandler = function errHandler() {
        reject(new Error('http error!'));
      };
      var timeoutHandler = function timeoutHandler() {
        resolve('Http Request is timeout, please try again.');
        isComplete = true;
      };
      xhr.onload = function () {};
      xhr.onabort = errHandler;
      xhr.onerror = errHandler;
      xhr.ontimeout = errHandler;
      xhr.open(opts.method, url, true);
      xhr.setRequestHeader('Access-Control-Allow-Headers', 'Origin,Content-Type,Accept');
      if (opts.method === 'POST') {
        xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
      }
      xhr.send(data);
    } catch (e) {
      reject(e);
    }
  });
}
function eliminateX(data) {
  if (Array.isArray(data)) {
    data.forEach(function (item) {
      eliminateX(item);
    });
    return data;
  }
  if (!(0, _utils.isObject)(data)) return data;
  Object.keys(data).forEach(function (key) {
    if (/^x_/i.test(key)) {
      delete data[key];
    } else {
      if (Array.isArray(data[key])) {
        eliminateX(data[key]);
      } else if ((0, _utils.isObject)(data[key])) {
        var child = eliminateX(data[key]);
        Object.keys(child).length || delete data[key];
      }
    }
  });
  return data;
}
function mobileRequest(url) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  console.log('get in mobile');
  if (!webBridge) return _promise2.default.as(new Error('no web bridge!!'));
  return new _promise2.default(function (resolve, reject) {
    data['fname'] = url;
    webBridge.callHandler('mobileBridge', data, function responseCallback(v) {
      if (v && (0, _utils.isObject)(v)) {
        v = JSON.parse(JSON.stringify(v));
        v.errcode || (v.errcode = 0);
      } else {
        v = { errcode: 9999, errdesc: 'call error !' };
      }
      resolve({ data: v, headers: { 'content-type': 'application/json' } });
    });
  });
}
function request(url, data) {
  var p;
  if ((0, _utils.isObject)(data)) {
    data = eliminateX(JSON.parse(JSON.stringify(data)));
  }
  var isNative = /^\/native\//.test(url);
  if (isNative) {
    p = mobileRequest(url, data || {});
  } else {
    p = xhrRequest(url, data).then(function (xhr) {
      var type = xhr.getResponseHeader('content-type');
      var val = xhr.responseText;
      if (/json/.test(type)) {
        val = (0, _utils.toJSON)(val);
      }
      return val;
    });
  }
  p = p.then(function (data) {
    try {
      if (!(0, _utils.isObject)(data)) return data;
      (0, _utils.dateConvert)(data);
      if (data.errcode === 0) {
        return data;
      } else {
        console.error(url, { errcode: data.errcode, message: data.message }, data.errstack || '');
        return _promise2.default.as(new Error(data.errdesc || 'error'));
      }
    } catch (e) {
      if (e.errstack) {
        console.error(url, e.errstack);
      } else {
        console.error(url, e);
      }
      return _promise2.default.as(new Error(data.errdesc || 'error'));
    }
  });
  return p;
}
exports.request = request;
exports.xhrRequest = xhrRequest;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = __webpack_require__(1);

function getQuerystring(url, data) {
  var len = 0;
  var keys = Object.keys(data);
  for (var i = 0; i < keys.length; i++) {
    var value = data[keys[i]];
    var strType = (0, _utils.getType)(value);
    if (strType === '[object Object]' || strType === '[object Array]') {
      return '';
    }
    if (!value) continue;
    len += value.length || 0;
  }
  return len < 512 ? url + '?' + (0, _utils.querystring)(data) : '';
} /**
   * Created by lichuanjing on 2017/6/1.
   */
/* eslint-disable */
exports.default = getQuerystring;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {/* globals __webpack_amd_options__ */
module.exports = __webpack_amd_options__;

/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /* eslint-disable */


var _eventer = __webpack_require__(2);

var _eventer2 = _interopRequireDefault(_eventer);

var _promise = __webpack_require__(0);

var _promise2 = _interopRequireDefault(_promise);

var _request = __webpack_require__(3);

var _getQuerystring = __webpack_require__(4);

var _getQuerystring2 = _interopRequireDefault(_getQuerystring);

var _objectid = __webpack_require__(8);

var _objectid2 = _interopRequireDefault(_objectid);

var _href = __webpack_require__(9);

var _href2 = _interopRequireDefault(_href);

var _nativeBridge = __webpack_require__(10);

var _pull = __webpack_require__(11);

var _pull2 = _interopRequireDefault(_pull);

var _ls = __webpack_require__(12);

var _ls2 = _interopRequireDefault(_ls);

__webpack_require__(13);

var _md = __webpack_require__(14);

var _md2 = _interopRequireDefault(_md);

var _device = __webpack_require__(15);

var _device2 = _interopRequireDefault(_device);

var _utils = __webpack_require__(1);

var _loader = __webpack_require__(16);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

!function (global) {
  var dangjia = new _eventer2.default();
  Object.defineProperties(dangjia, {
    'Eventer': {
      get: function get() {
        return _eventer2.default;
      },
      enumerable: true
    },
    'Promise': {
      get: function get() {
        return _promise2.default;
      }
    },
    'request': {
      get: function get() {
        return _request.request;
      }
    },
    'xhrRequest': {
      get: function get() {
        return _request.xhrRequest;
      }
    },
    'ObjectID': {
      get: function get() {
        return (0, _objectid2.default)().toString();
      },
      enumerable: true
    },
    'getQuerystring': {
      get: function get() {
        return _getQuerystring2.default;
      }
    },
    'href': {
      get: function get() {
        return (0, _href2.default)(window.location.href);
      },
      enumerable: true
    },
    'getParamByUrl': {
      get: function get() {
        return _utils.getParamByUrl;
      }
    },
    'regNative': {
      get: function get() {
        return _nativeBridge.regNative;
      }
    },
    'callNative': {
      get: function get() {
        return _nativeBridge.callNative;
      }
    },
    'pull': {
      get: function get() {
        return (0, _pull2.default)();
      },
      enumerable: true
    },
    'LS': {
      get: function get() {
        return _ls2.default;
      },
      enumerable: true
    },
    'lsValue': {
      get: function get() {
        return _ls2.default.prototype.value.bind(_ls2.default);
      },
      enumerable: true
    },
    'md5': {
      get: function get() {
        return _md2.default;
      }
    },
    'device': {
      get: function get() {
        return _device2.default;
      }
    },
    'load': {
      get: function get() {
        return _loader.loadInjection;
      }
    }
  });
  if ("function" === 'function' && _typeof(__webpack_require__(5)) === 'object' && __webpack_require__(5)) {
    !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
      return dangjia;
    }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = dangjia;
    module.exports.dangjia = dangjia;
  } else {
    global.dangjia = global.dj = window.dj = dangjia;
  }
}(window || undefined);

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var state = {
  awaiting: 0,
  resolved: 1,
  rejected: 2
};

var Promise = function () {
  function Promise(cb) {
    _classCallCheck(this, Promise);

    this.callbacks = [];
    this.state = state.awaiting;
    this.resolvedTo = null;
    this.rejectedTo = null;
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
    this._next = this._next.bind(this);
    this.then = this.then.bind(this);
    cb(this.resolve, this.reject);
  }

  _createClass(Promise, [{
    key: "resolve",
    value: function resolve(result) {
      this.state = state.resolved;
      this.resolvedTo = result;
      this._next(result);
    }
  }, {
    key: "reject",
    value: function reject(err) {
      this.state = state.rejected;
      this.rejectedTo = err;
      this._next(null, err);
    }
  }, {
    key: "_unwrap",
    value: function _unwrap(promise, resolve) {
      var _this = this;

      if (promise instanceof Promise) {
        promise.then(function (result) {
          _this._unwrap(result, resolve);
        });
        return;
      }
      resolve(promise);
    }
    //open up all callbacks that were waiting on this given promise. (.thened on it)

  }, {
    key: "_next",
    value: function _next() {
      var resolution = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
      var rejection = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      //return a new promise...
      while (this.callbacks.length > 0) {
        var deferred = this.callbacks.shift();
        if (deferred) {
          var didResolve = deferred.didResolve;
          var didReject = deferred.didReject;
          var reject = deferred.reject;
          var resolve = deferred.resolve;

          switch (this.state) {
            case state.resolved:
              var promise = didResolve(resolution); //TODO: unwrap potential promise promise being returned from cb.
              this._unwrap(promise, resolve);
              break;
            case state.rejected:
              reject(didReject(rejection));
              break;
          }
        }
      }
    }
  }, {
    key: "then",
    value: function then(didResolve, didReject) {
      var _this2 = this;

      //only go forward with .then once we've finished up with the previous promise.
      //the callback inside of .thens can also be async.
      //if the returned callback has a promise.. we continue down the chain. and provide it as the resolution or rejection to the next then statement.
      // console.log('about to handle ', didResolve, this.state, this.resolvedTo)
      return new Promise(function (resolve, reject) {
        if (_this2.state == state.resolved) {
          var promise = didResolve(_this2.resolvedTo);
          _this2._unwrap(promise, resolve);
        } else if (_this2.state == state.rejected) {
          // console.log('rejecting')
          reject(didReject(_this2.rejectedTo)); //TODO: need?
        } else {
          //defer this wrapped promise.
          // console.log('deferring ', didResolve)
          var defer = {
            didResolve: didResolve,
            didReject: didReject,
            resolve: resolve,
            reject: reject
          };
          _this2.callbacks = [].concat(_toConsumableArray(_this2.callbacks), [defer]);
        }
      });
    }
  }]);

  return Promise;
}();

exports.default = Promise;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Created by shenzhenhong on 2017/6/1.
 */
/* eslint-disable */
var MACHINE_ID = parseInt(Math.random() * 0xFFFFFF, 10);
var ObjectID = function ObjectID() {
  if (this instanceof ObjectID) {
    this.id = this.generate();
  } else {
    return new ObjectID();
  }
};
ObjectID.prototype.get_inc = function () {
  ObjectID.index = (ObjectID.index + 1) % 0xFFFFFF;
  return ObjectID.index;
};
ObjectID.prototype.generate = function () {
  var time = ~~(Date.now() / 1000);
  var pid = Math.floor(Math.random() * 100000);
  var inc = this.get_inc();
  var buffer = new Array(12);
  buffer[3] = time & 0xff;
  buffer[2] = time >> 8 & 0xff;
  buffer[1] = time >> 16 & 0xff;
  buffer[0] = time >> 24 & 0xff;
  buffer[6] = MACHINE_ID & 0xff;
  buffer[5] = MACHINE_ID >> 8 & 0xff;
  buffer[4] = MACHINE_ID >> 16 & 0xff;
  buffer[8] = pid & 0xff;
  buffer[7] = pid >> 8 & 0xff;
  buffer[11] = inc & 0xff;
  buffer[10] = inc >> 8 & 0xff;
  buffer[9] = inc >> 16 & 0xff;
  return buffer;
};
function bytes2Str(arr) {
  var str = '';
  for (var i = 0; i < arr.length; i++) {
    var tmp = arr[i].toString(16);
    if (tmp.length === 1) {
      tmp = '0' + tmp;
    }
    str += tmp;
  }
  return str;
}

ObjectID.prototype.toString = function () {
  return bytes2Str(this.id);
};
ObjectID.index = ~~(Math.random() * 0xFFFFFF);

exports.default = ObjectID;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Created by lichuanjing on 2017/6/1.
 */
/* eslint-disable */
function parseURL(url) {
  var a = document.createElement('a');
  a.href = url;
  return {
    source: url,
    protocol: a.protocol.replace(':', ''),
    host: a.hostname,
    port: a.port,
    query: a.search,
    params: function () {
      var ret = {};
      var seg = a.search.replace(/^\?/, '').split('&');
      var len = seg.length;
      var i = 0;
      var s;
      for (i; i < len; i++) {
        if (!seg[i]) {
          continue;
        }
        s = seg[i].split('=');
        ret[s[0]] = s[1];
      }
      return ret;
    }(),
    file: (a.pathname.match(/\/([^/?#]+)$/i) || [''])[1],
    hash: a.hash.replace('#', ''),
    path: a.pathname.replace(/^([^/])/, '/$1'),
    relative: (a.href.match(/tps?:\/\/[^/]+(.+)/) || [''])[1],
    segments: a.pathname.replace(/^\//, '').split('/')
  };
}

exports.default = parseURL;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.callNative = exports.unRegNative = exports.regNative = undefined;

var _promise = __webpack_require__(0);

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by lichuanjing on 2017/6/1.
 */
/* eslint-disable */
var regNativeMap = {};

function setupWebViewJavascriptBridge(callback) {
  if (window.WebViewJavascriptBridge) {
    return callback(WebViewJavascriptBridge);
  }
  if (window.WVJBCallbacks) {
    return window.WVJBCallbacks.push(callback);
  }
  window.WVJBCallbacks = [callback];
  var WVJBIframe = document.createElement('iframe');
  WVJBIframe.style.display = 'block';
  WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
  document.documentElement.appendChild(WVJBIframe);
  setTimeout(function () {
    document.documentElement.removeChild(WVJBIframe);
  }, 0);
}
var regNative = function regNative(fName, fn) {
  var _fnInstance = regNativeMap[fName];
  if (_fnInstance) {
    console.error('The fName' + fName + 'has been register!!!');
    return;
  } else {
    regNativeMap[fName] = fn;
    // 需要改动，目前returns只支持promise返回值
    setupWebViewJavascriptBridge(function (bridge) {
      bridge.registerHandler(fName, function (data, responseCallback) {
        var res = data && JSON.parse(JSON.stringify(data));
        var returns = regNativeMap[fName](res);
        returns.then(function (cbData) {
          return responseCallback(cbData);
        });
        // }
      });
    });
  }
};
var nativeBridge = null;
setupWebViewJavascriptBridge(function (bridge) {
  nativeBridge = bridge;
});
var unRegNative = function unRegNative(fName) {
  delete regNativeMap[fName];
};
var callNative = function callNative(funcName, data, func) {
  if (!nativeBridge) return _promise2.default.as(new Error('No Native Bridge!'));
  return new _promise2.default(function (resolve, reject) {
    nativeBridge.callHandler(funcName, data, function responseCallback(resData) {
      if (!resData) {
        resData = { errcode: 9999, errdesc: 'call error !' };
      } else {
        resData = JSON.parse(JSON.stringify(resData));
        resData.errcode || (resData.errcode = 0);
      }
      resolve(resData);
    });
  });
};
exports.regNative = regNative;
exports.unRegNative = unRegNative;
exports.callNative = callNative;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _request = __webpack_require__(3);

/**
 * Created by lichuanjing on 2017/6/1.
 */
/* eslint-disable */
var apiList = {
  direct: { url: '/api/direct' },
  signIn: { url: '/api/system/signin' },
  signOff: { url: '/api/system/signoff' },
  queryProductSort: { url: '/api/product/queryProductSort' },
  mobileHome: { url: '/api/mobileHome' },
  mobileHotPage: { url: '/api/mobileHotPage' },
  mobileSortProds: { url: '/api/mobileSortProds' },
  queryProdInfo: { url: '/api/product/queryProdInfo' },
  queryProdsByType: { url: '/api/business/queryProdsByType' },
  billMainInfo: { url: '/api/business/billMainInfo' },
  upsertBillMain: { url: '/api/business/upsertBillMain' },
  getConfigure: { url: '/api/support/getConfigure' },
  queryCustCompany: { url: '/api/crm/queryCustCompany' },
  updateCustCompany: { url: '/api/crm/updateCustCompany' },
  queryCustBank: { url2: '/api/crm/queryCustBank' },
  queryPiProd: { url: '/api/business/queryPiProd' },
  updatePiProd: { url: '/api/business/updatePiProd' },
  getMgbField: { url: '/api/support/getMgbField' }
};
var nativeList = {
  goNegotiateVC: { url: '/native/goNegotiateVC' }
};

var pull = {};
pulll.init = function (arr) {
  var pullAll = arr;
  var pullMap = {};
  Object.keys(pullAll).forEach(function (key) {
    var item = pullAll[key];
    var req = _request.request;
    var url = item.url || item.url2;
    var func = function func(data) {
      return req(url, data);
    };
    pullMap[key] = func;
  });
  return pullMap;
};

exports.default = pull;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = __webpack_require__(1);

var _eventer = __webpack_require__(2);

var _eventer2 = _interopRequireDefault(_eventer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by lichuanjing on 2017/6/1.
 */
/* eslint-disable */
var locUrl = window.location.href;
function LStorage() {}
if (!window.dangjia) {
  window.dangjia = new _eventer2.default();
}
LStorage.prototype.store = function () {
  return window.localStorage;
};
LStorage.prototype.value = function (key, data) {
  var newdata = data;
  if (!key) return;
  if (typeof data === 'undefined') {
    data = this.store().getItem(key);
    data = (0, _utils.toJSON)(data);
  } else {
    if (data) {
      data = JSON.stringify(data);
      var old = this.store().getItem(key) || '{}';
      this.store().setItem(key, data);
      if (old !== data) {
        dangjia.emit('storage', key, newdata, (0, _utils.toJSON)(old), true, locUrl);
      }
    }
  }
  return data;
};
LStorage.prototype.remove = function (key) {
  var old = this.store().getItem(key) || '{}';
  old = (0, _utils.toJSON)(old);
  dangjia.emit('storage', key, null, old, true, locUrl);
  return this.store().removeItem(key);
};
LStorage.prototype.clearAll = function () {
  dangjia.emit('storage', 'all', null, null, true, locUrl);
  return this.store().clear();
};
function handleStorage(e) {
  if (!e) return;
  var newValue = (0, _utils.toJSON)(e.newValue);
  var oldValue = (0, _utils.toJSON)(e.oldValue);
  dangjia.emit('storage', e.key, newValue, oldValue, false, e.url);
}
if (window.addEventListener) {
  window.addEventListener('storage', handleStorage, false);
} else if (window.attachEvent) {
  window.attachEvent('onstorage', handleStorage);
}
var lStorage = new LStorage();
exports.default = lStorage;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Created by wangmin on 16/12/1.
 */
/* eslint-disable */
Object._clone = function (v) {
  if (!v) return v;
  return JSON.parse(JSON.stringify(v));
};
Array.prototype.contains = function (obj) {
  var isFunction = typeof obj === 'function';
  var i = this.length;
  while (i--) {
    var item = this[i];
    if (isFunction) {
      if (obj(item)) {
        return item;
      }
    } else {
      if (item === obj) {
        return item;
      }
    }
  }
};
//数组转对象
Array.prototype._object = function (field) {
  var obj = {};
  if (!field) return obj;
  for (var i = 0; i < this.length; i++) {
    var item = this[i];
    obj[item[field]] = item;
  }
  return obj;
};
//得到选中的
Array.prototype._selected = function (field, eq) {
  var arr = [];
  typeof eq === 'undefined' && (eq = true);
  if (!field) return arr;
  for (var i = 0; i < this.length; i++) {
    var item = this[i];
    if (item[field] === eq) arr.push(item);
  }
  return arr;
};
Array.prototype._push = function (arr) {
  if (!arr) return;
  for (var i = 0; i < arr.length; i++) {
    this.push(arr[i]);
  }
  return this;
};
Array.prototype._assign = function (ext) {
  if (!ext) return;
  for (var i = 0; i < this.length; i++) {
    Object.assign(this[i], ext);
  }
  return this;
};
Array.prototype.toGroup = function (field) {
  var obj = {};
  if (!field) return obj;
  for (var i = 0; i < this.length; i++) {
    var item = this[i];
    var v = obj[item[field]];
    if (!v) {
      v = [];
      obj[item[field]] = v;
    }
    v.push(item);
  }
  return obj;
};
Array.prototype.find || (Array.prototype.find = Array.prototype.contains);

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (string) {

  function RotateLeft(lValue, iShiftBits) {
    return lValue << iShiftBits | lValue >>> 32 - iShiftBits;
  }

  function AddUnsigned(lX, lY) {
    var lX4, lY4, lX8, lY8, lResult;
    lX8 = lX & 0x80000000;
    lY8 = lY & 0x80000000;
    lX4 = lX & 0x40000000;
    lY4 = lY & 0x40000000;
    lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
    if (lX4 & lY4) {
      return lResult ^ 0x80000000 ^ lX8 ^ lY8;
    }
    if (lX4 | lY4) {
      if (lResult & 0x40000000) {
        return lResult ^ 0xC0000000 ^ lX8 ^ lY8;
      } else {
        return lResult ^ 0x40000000 ^ lX8 ^ lY8;
      }
    } else {
      return lResult ^ lX8 ^ lY8;
    }
  }

  function F(x, y, z) {
    return x & y | ~x & z;
  }

  function G(x, y, z) {
    return x & z | y & ~z;
  }

  function H(x, y, z) {
    return x ^ y ^ z;
  }

  function I(x, y, z) {
    return y ^ (x | ~z);
  }

  function FF(a, b, c, d, x, s, ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  }

  function GG(a, b, c, d, x, s, ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  }

  function HH(a, b, c, d, x, s, ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  }

  function II(a, b, c, d, x, s, ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  }

  function ConvertToWordArray(string) {
    var lWordCount;
    var lMessageLength = string.length;
    var lNumberOfWords_temp1 = lMessageLength + 8;
    var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - lNumberOfWords_temp1 % 64) / 64;
    var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
    var lWordArray = Array(lNumberOfWords - 1);
    var lBytePosition = 0;
    var lByteCount = 0;
    while (lByteCount < lMessageLength) {
      lWordCount = (lByteCount - lByteCount % 4) / 4;
      lBytePosition = lByteCount % 4 * 8;
      lWordArray[lWordCount] = lWordArray[lWordCount] | string.charCodeAt(lByteCount) << lBytePosition;
      lByteCount++;
    }
    lWordCount = (lByteCount - lByteCount % 4) / 4;
    lBytePosition = lByteCount % 4 * 8;
    lWordArray[lWordCount] = lWordArray[lWordCount] | 0x80 << lBytePosition;
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
    return lWordArray;
  }

  function WordToHex(lValue) {
    var WordToHexValue = "",
        WordToHexValue_temp = "",
        lByte,
        lCount;
    for (lCount = 0; lCount <= 3; lCount++) {
      lByte = lValue >>> lCount * 8 & 255;
      WordToHexValue_temp = "0" + lByte.toString(16);
      WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
    }
    return WordToHexValue;
  }

  function Utf8Encode(string) {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "";

    for (var n = 0; n < string.length; n++) {

      var c = string.charCodeAt(n);

      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if (c > 127 && c < 2048) {
        utftext += String.fromCharCode(c >> 6 | 192);
        utftext += String.fromCharCode(c & 63 | 128);
      } else {
        utftext += String.fromCharCode(c >> 12 | 224);
        utftext += String.fromCharCode(c >> 6 & 63 | 128);
        utftext += String.fromCharCode(c & 63 | 128);
      }
    }

    return utftext;
  }

  var x = Array();
  var k, AA, BB, CC, DD, a, b, c, d;
  var S11 = 7,
      S12 = 12,
      S13 = 17,
      S14 = 22;
  var S21 = 5,
      S22 = 9,
      S23 = 14,
      S24 = 20;
  var S31 = 4,
      S32 = 11,
      S33 = 16,
      S34 = 23;
  var S41 = 6,
      S42 = 10,
      S43 = 15,
      S44 = 21;

  string = Utf8Encode(string);

  x = ConvertToWordArray(string);

  a = 0x67452301;
  b = 0xEFCDAB89;
  c = 0x98BADCFE;
  d = 0x10325476;

  for (k = 0; k < x.length; k += 16) {
    AA = a;
    BB = b;
    CC = c;
    DD = d;
    a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
    d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
    c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
    b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
    a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
    d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
    c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
    b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
    a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
    d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
    c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
    b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
    a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
    d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
    c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
    b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
    a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
    d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
    c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
    b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
    a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
    d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
    c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
    b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
    a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
    d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
    c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
    b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
    a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
    d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
    c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
    b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
    a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
    d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
    c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
    b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
    a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
    d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
    c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
    b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
    a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
    d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
    c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
    b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
    a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
    d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
    c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
    b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
    a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
    d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
    c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
    b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
    a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
    d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
    c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
    b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
    a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
    d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
    c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
    b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
    a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
    d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
    c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
    b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
    a = AddUnsigned(a, AA);
    b = AddUnsigned(b, BB);
    c = AddUnsigned(c, CC);
    d = AddUnsigned(d, DD);
  }

  var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);

  return temp.toLowerCase();
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Created by lichuanjing on 2017/6/5.
 */
var device = function device() {
  var deviceInfo = {
    OsType: '',
    deviceType: '',
    deviceVersion: ''
  };
  var userAgent = navigator.userAgent;
  deviceInfo.deviceVersion = navigator.appVersion;
  if (userAgent.indexOf('Android') > -1 || userAgent.indexOf('Linux') > -1) {
    deviceInfo.deviceType = 'ANDROID';
  }
  if (userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
    deviceInfo.OsType = 'IOS';
    if (userAgent.indexOf('iPhone') !== -1) {
      deviceInfo.deviceType = 'IPHONE';
    }
    if (userAgent.indexOf('iPad') !== -1) {
      deviceInfo.deviceType = 'IPAD';
    }
  }
  return deviceInfo;
};
exports.default = device();

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadInjection = undefined;

var _promise = __webpack_require__(0);

var _promise2 = _interopRequireDefault(_promise);

var _eventer = __webpack_require__(2);

var _eventer2 = _interopRequireDefault(_eventer);

var _request = __webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function merge(a, b) {
  if (!a || !b) return a;
  Object.keys(b).forEach(function (k) {
    a[k] = b[k];
  });
  return a;
} /**
   * Created by lichuanjing on 2017/6/13.
   */

function fileType(str) {
  var matchs = str.match(/\.(\w+)($|\?)/) || [];
  var ext = matchs[1] || 'unknown';
  return ext;
}
function defineJs(urlObj) {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  try {
    script.appendChild(document.createTextNode(urlObj.xhr.responseText));
  } catch (e) {
    script.text = urlObj.xhr.responseText;
  }
  delete urlObj.xhr;
  var element = document.getElementsByTagName('head')[0];
  element.appendChild(script);
  urlObj.injected = true;
}
function defineCss(urlObj) {
  var style = document.createElement('style');
  style.type = 'text/css';
  try {
    style.appendChild(document.createTextNode(urlObj.xhr.responseText));
  } catch (e) {
    style.styleSheet.cssText = urlObj.xhr.responseText;
  }
  delete urlObj.xhr;
  var element = document.getElementsByTagName('head')[0];
  element.appendChild(style);
  urlObj.injected = true;
}
function attachImg(urlObj) {
  var img = this.element;
  if (typeof img === 'string') {
    img = document.querySelector(img);
  }
  if (!(img instanceof window.HTMLImageElement)) {
    img = new window.Image();
  }
  img.onload = function (e) {
    window.URL.revokeObjectURL(img.src);
  };
  img.src = window.URL.createObjectURL(urlObj.xhr.response);
  urlObj.injected = true;
}
function ResContext(urls, element) {
  var self = this;
  _eventer2.default.call(this);
  urls = urls || [];
  Array.isArray(urls) || (urls = [urls]);
  this.urls = [];
  this.completeIndex = -1;
  this.isError = false;
  this.element = element;
  urls.forEach(function (url) {
    var type = fileType(url);
    var typeObj = {};
    if (type === 'js') {
      typeObj['isJs'] = true;
    } else if (type === 'css') {
      typeObj['isCss'] = true;
    } else if (/jp[e]?g|png/.test(type)) {
      typeObj['isImg'] = true;
    }
    var urlObj = merge({
      type: type,
      url: url,
      loading: false,
      loaded: false,
      injected: false,
      text: ''
    }, typeObj);
    self.urls.push(urlObj);
  });
  this.on('next', onNext.bind(this));
  this.on('complete', onComplete.bind(this));
}
ResContext.prototype = _eventer2.default.prototype;
function onComplete() {
  this._onComplete && this._onComplete();
}
function tryLoad(urlObj) {
  var self = this;
  var p;
  var opts = { method: 'GET' };
  urlObj.isImg && (opts['responseType'] = 'blob');
  p = (0, _request.xhrRequest)(urlObj.url, null, opts);
  p.then(function (xhr) {
    urlObj['xhr'] = xhr;
    urlObj.loading = true;
    self.emit('next');
  }, function (e) {
    console.log(e);
  });
}
function onNext() {
  var curIndex = this.completeIndex + 1;
  var urlObj = this.urls[curIndex];
  if (!urlObj || urlObj.loaded || urlObj.injected || !urlObj.xhr) return;
  urlObj.loaded = true;
  var fn;
  urlObj.isJs && (fn = defineJs);
  urlObj.isCss && (fn = defineCss);
  urlObj.isImg && (fn = attachImg);
  fn.call(this, urlObj);
  this.completeIndex = curIndex;
  if (curIndex === this.urls.length - 1) {
    this.emit('complete');
  } else {
    this.emit('next');
  }
}
function loadContext() {
  var self = this;
  self.urls.forEach(function (urlObj) {
    tryLoad.call(self, urlObj);
  });
}
function docReady() {
  if (document.readyState === 'complete') {
    return _promise2.default.as();
  }
  return new _promise2.default(function (resolve, reject) {
    if (document.all) {
      document.onreadystatechange = function () {
        if (document.readyState === 'loaded' || document.readyState === 'complete') {
          resolve();
        }
      };
    } else {
      document.addEventListener('DOMContentLoaded', function () {
        resolve();
      }, false);
    }
  });
}
function loadInjection(urls, element) {
  Array.isArray(urls) || (urls = [urls]);
  return docReady().then(function () {
    return new _promise2.default(function (resolve, reject) {
      var res = new ResContext(urls, element);
      if (!urls || !urls.length) return resolve();
      res._onComplete = function () {
        resolve();
      };
      res._onFail = function () {
        reject();
      };
      setTimeout(function () {
        loadContext.call(res);
      });
    });
  });
}
exports.loadInjection = loadInjection;

/***/ })
/******/ ]);