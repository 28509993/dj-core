/**
 * Created by lichuanjing on 2017/6/5.
 */
const device = function () {
  let deviceInfo = {
    OsType: '',
    deviceType: '',
    deviceVersion: ''
  }
  let userAgent = navigator.userAgent
  deviceInfo.deviceVersion = navigator.appVersion
  if (userAgent.indexOf('Android') > -1 || userAgent.indexOf('Linux') > -1) {
    deviceInfo.deviceType = 'ANDROID'
  }
  if (userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
    deviceInfo.OsType = 'IOS'
    if (userAgent.indexOf('iPhone') !== -1) {
      deviceInfo.deviceType = 'IPHONE'
    }
    if (userAgent.indexOf('iPad') !== -1) {
      deviceInfo.deviceType = 'IPAD'
    }
  }
  return deviceInfo
}
export default device()
