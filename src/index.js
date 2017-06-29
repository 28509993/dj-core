/* eslint-disable */
import Eventer from './lib/eventer'
import Promise from './lib/promise'
import {request, xhrRequest} from './lib/request'
import getQuerystring from './lib/getQuerystring'
import ObjectID from './lib/objectid'
import parseURL from './lib/href'
import {regNative, callNative} from './lib/native-bridge'
import pull from './lib/pull'
import lStorage from './lib/ls'
import './lib/object-extend'
import md5 from './lib/md5'
import device from './lib/device'
import {getParamByUrl} from './lib/utils'
import {loadInjection} from './lib/loader'
!(function (global) {
  var dangjia = new Eventer()
  Object.defineProperties(dangjia, {
    'Eventer': {
      get: function () {
        return Eventer
      },
      enumerable: true
    },
    'Promise': {
      get: function () {
        return Promise
      }
    },
    'request': {
      get: function () {
        return request
      }
    },
    'xhrRequest': {
      get: function () {
        return xhrRequest
      }
    },
    'ObjectID': {
      get: function () {
        return ObjectID().toString()
      },
      enumerable: true
    },
    'getQuerystring': {
      get: function () {
        return getQuerystring
      }
    },
    'href': {
      get: function () {
        return parseURL(window.location.href)
      },
      enumerable: true
    },
    'getParamByUrl': {
      get: function () {
        return getParamByUrl
      }
    },
    'regNative': {
      get: function () {
        return regNative
      }
    },
    'callNative': {
      get: function () {
        return callNative
      }
    },
    'pull': {
      get: function () {
        return pull()
      },
      enumerable: true
    },
    'LS': {
      get: function () {
        return lStorage
      },
      enumerable: true
    },
    'lsValue': {
      get: function () {
        return lStorage.prototype.value.bind(lStorage)
      },
      enumerable: true
    },
    'md5': {
      get: function () {
        return md5
      }
    },
    'device': {
      get: function () {
        return device
      }
    },
    'load': {
      get: function () {
        return loadInjection
      }
    }
  })
  global.dangjia = global.dj = dangjia
})(window)

