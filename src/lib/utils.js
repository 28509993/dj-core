/**
 * Created by lichuanjing on 2017/6/1.
 */
/* eslint-disable */
function isObject (value) {
  return Object.prototype.toString.call(value) === '[object Object]'
}
function dateConvert (v) {
  if (isObject(v)) {
    return v
  }
  Object.keys(v).forEach(function (key) {
    var value = v[key]
    if (/_date$/i.test(key) && typeof value === 'string') {
      try {
        var dt = new Date(value)
        v[key] = dt
      } catch (err) {
      }
    } else if (isObject(value)) {
      dateConvert(value)
    } else if (Array.isArray(value)) {
      value.forEach(function (vv) {
        dateConvert(vv)
      })
    }
  })
  return v
}
function toJSON (v) {
  try {
    return JSON.parse(v)
  } catch (e) {
    return v
  }
}
function getType (value) {
  return Object.prototype.toString.call(value)
}
function stringifyPrimitive (v) {
  if (Object.prototype.toString.call(v) === '[object Date]') {
    return v.toISOString()
  }
  switch (typeof v) {
    case 'string':
      return v
    case 'boolean':
      return v ? 'true' : 'false'
    case 'number':
      return isFinite(v) ? v : ''
    default:
      return ''
  }
}
function querystring (obj) {
  var sep = '&'
  var eq = '='
  if (obj === null) {
    obj = undefined
  }
  return Object.keys(obj).map(function (k) {
    var ks = encodeURIComponent(stringifyPrimitive(k)) + eq
    if (Array.isArray(obj[k])) {
      return obj[k].map(function (v) {
        return ks + encodeURIComponent(stringifyPrimitive(v))
      }).join(sep)
    } else {
      return ks + encodeURIComponent(stringifyPrimitive(obj[k]))
    }
  }).join(sep)
}
function getParamByUrl (url, name) {
  var reg = new RegExp('(^|\\?|&)' + name + '=([^&]*)(\\s|&|$)', 'i')
  if (reg.test(url)) {
    return unescape(RegExp.$2.replace(/\+/g, ' '))
  }
  return ''
}
function ossUrl(url) {
  if (!url) return url
  if (typeof url === 'string') {
    url = url.replace(/oss-cn-hangzhou.aliyuncs.com/,'wokelink.com');
  }
  return url
}

export {isObject, dateConvert, getType, toJSON, stringifyPrimitive, querystring, getParamByUrl,ossUrl}
