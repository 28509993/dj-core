/**
 * Created by lichuanjing on 2017/6/1.
 */
/* eslint-disable */
import {toJSON} from './utils'
import Eventer from './eventer'
var locUrl = window.location.href
function LStorage () {
}
if (!window.dangjia) {
  window.dangjia = new Eventer()
}
LStorage.prototype.store = function () {
  return window.localStorage
}
LStorage.prototype.value = function (key, data) {
  var newdata = data
  if (!key) return
  if (typeof data === 'undefined') {
    data = this.store().getItem(key)
    data = toJSON(data)
  } else {
    if (data) {
      data = JSON.stringify(data)
      var old = this.store().getItem(key) || '{}'
      this.store().setItem(key, data)
      if (old !== data) {
        dangjia.emit('storage', key, newdata, toJSON(old), true, locUrl)
      }
    }
  }
  return data
}
LStorage.prototype.remove = function (key) {
  var old = this.store().getItem(key) || '{}'
  old = toJSON(old)
  dangjia.emit('storage', key, null, old, true, locUrl)
  return this.store().removeItem(key)
}
LStorage.prototype.clearAll = function () {
  dangjia.emit('storage', 'all', null, null, true, locUrl)
  return this.store().clear()
}
function handleStorage (e) {
  if (!e) return
  var newValue = toJSON(e.newValue)
  var oldValue = toJSON(e.oldValue)
  dangjia.emit('storage', e.key, newValue, oldValue, false, e.url)
}
if (window.addEventListener) {
  window.addEventListener('storage', handleStorage, false)
} else if (window.attachEvent) {
  window.attachEvent('onstorage', handleStorage)
}
var lStorage = new LStorage()
export default lStorage
