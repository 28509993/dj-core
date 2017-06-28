/**
 * Created by shenzhenhong on 2017/6/1.
 */
/* eslint-disable */
var MACHINE_ID = parseInt(Math.random() * 0xFFFFFF, 10)
var ObjectID = function ObjectID () {
  if (this instanceof ObjectID) {
    this.id = this.generate()
  } else {
    return new ObjectID()
  }
}
ObjectID.prototype.get_inc = function () {
  ObjectID.index = (ObjectID.index + 1) % 0xFFFFFF
  return ObjectID.index
}
ObjectID.prototype.generate = function () {
  var time = ~~(Date.now() / 1000)
  var pid = Math.floor(Math.random() * 100000)
  var inc = this.get_inc()
  var buffer = new Array(12)
  buffer[3] = time & 0xff
  buffer[2] = (time >> 8) & 0xff
  buffer[1] = (time >> 16) & 0xff
  buffer[0] = (time >> 24) & 0xff
  buffer[6] = MACHINE_ID & 0xff
  buffer[5] = (MACHINE_ID >> 8) & 0xff
  buffer[4] = (MACHINE_ID >> 16) & 0xff
  buffer[8] = pid & 0xff
  buffer[7] = (pid >> 8) & 0xff
  buffer[11] = inc & 0xff
  buffer[10] = (inc >> 8) & 0xff
  buffer[9] = (inc >> 16) & 0xff
  return buffer
}
function bytes2Str (arr) {
  var str = ''
  for (var i = 0; i < arr.length; i++) {
    var tmp = arr[i].toString(16)
    if (tmp.length === 1) {
      tmp = '0' + tmp
    }
    str += tmp
  }
  return str
}

ObjectID.prototype.toString = function () {
  return bytes2Str(this.id)
}
ObjectID.index = ~~(Math.random() * 0xFFFFFF)

export default ObjectID