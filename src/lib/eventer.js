/**
 * Created by lichuanjing on 2017/6/1.
 */
/* eslint-disable */
function Eventer () {
  Eventer.init.call(this)
}
Eventer.init = function () {
  if (!this._events || this._events === Object.getPrototypeOf(this)._events) {
    this._events = {}
  }
}
Eventer.prototype.addListener = function addListener (type, listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('listener must be a function')
  }
  var events = this._events
  var existing
  if (!events) {
    events = this._events = {}
  } else {
    existing = events[type]
  }
  if (!existing) {
    existing = events[type] = listener
  } else {
    if (typeof existing === 'function') {
      existing = events[type] = [existing, listener]
    } else {
      existing.push(listener)
    }
  }
  return this
}
Eventer.prototype.emit = function emit (type) {
  var handler, events
  var self = this
  events = self._events || {}
  handler = events[type]
  var args = Array.prototype.slice.call(arguments).splice(1)
  if (!handler) return false
  setTimeout(function () {
    if (typeof handler === 'function') {
      handler.apply(self, args)
    } else {
      var i = handler.length
      var arr = new Array(i)
      while (i--) {
        arr[i] = handler[i]
      }
      arr.forEach(function (fn) {
        fn.apply(self, args)
      })
    }
  }, 1)
  return true
}
Eventer.prototype.removeListener = function removeListener (type, listener) {
  var events = this._events
  if (!type || typeof listener !== 'function') return this
  var list = events[type]
  if (!list) return this
  if (listener === list) {
    delete events[type]
    return this
  }
  if (Array.isArray(list)) {
    for (var i = 0; i < list.length; i++) {
      var handler = list[i]
      if (handler === listener) {
        list.splice(i, 1)
        break
      }
    }
    if (!list.length) delete events[type]
  }
  return this
}
Eventer.prototype.on = Eventer.prototype.addListener
Eventer.prototype.remove = Eventer.prototype.removeListener
export default Eventer