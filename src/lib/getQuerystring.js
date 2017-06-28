/**
 * Created by lichuanjing on 2017/6/1.
 */
/* eslint-disable */
import {querystring, getType} from './utils'
function getQuerystring (url, data) {
  var len = 0
  var keys = Object.keys(data)
  for (var i = 0; i < keys.length; i++) {
    var value = data[keys[i]]
    var strType = getType(value)
    if (strType === '[object Object]' || strType === '[object Array]') {
      return ''
    }
    if (!value) continue
    len += (value.length || 0)
  }
  return len < 512 ? (url + '?' + querystring(data)) : ''
}
export default getQuerystring