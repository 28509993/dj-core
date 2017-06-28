/**
 * Created by wangmin on 16/12/1.
 */
/* eslint-disable */
Object._clone = (v) => {
  if (!v) return v
  return JSON.parse(JSON.stringify(v))
}
Array.prototype.contains = function (obj) {
  var isFunction = typeof obj === 'function'
  var i = this.length;
  while (i--) {
    var item = this[i]
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
}
//数组转对象
Array.prototype._object = function (field) {
  var obj = {}
  if (!field) return obj
  for (var i = 0; i < this.length; i++) {
    var item = this[i]
    obj[item[field]] = item
  }
  return obj
}
//得到选中的
Array.prototype._selected = function (field, eq) {
  var arr = []
  typeof eq === 'undefined' && (eq = true)
  if (!field) return arr
  for (var i = 0; i < this.length; i++) {
    var item = this[i]
    if (item[field] === eq) arr.push(item)
  }
  return arr
}
Array.prototype._push = function (arr) {
  if (!arr) return
  for (var i = 0; i < arr.length; i++) {
    this.push(arr[i])
  }
  return this
}
Array.prototype._assign = function (ext) {
  if (!ext) return
  for (var i = 0; i < this.length; i++) {
    Object.assign(this[i], ext)
  }
  return this
}
Array.prototype.toGroup = function (field) {
  var obj = {}
  if (!field) return obj
  for (var i = 0; i < this.length; i++) {
    var item = this[i]
    var v = obj [item[field]]
    if (!v) {
      v = []
      obj [item[field]] = v
    }
    v.push(item)
  }
  return obj
}
Array.prototype.find || (Array.prototype.find = Array.prototype.contains)
