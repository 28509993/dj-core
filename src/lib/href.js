/**
 * Created by lichuanjing on 2017/6/1.
 */
/* eslint-disable */
function parseURL (url) {
  var a = document.createElement('a')
  a.href = url
  return {
    source: url,
    protocol: a.protocol.replace(':', ''),
    host: a.hostname,
    port: a.port,
    query: a.search,
    params: (function () {
      var ret = {}
      var seg = a.search.replace(/^\?/, '').split('&')
      var len = seg.length
      var i = 0
      var s
      for (i; i < len; i++) {
        if (!seg[i]) {
          continue
        }
        s = seg[i].split('=')
        ret[s[0]] = s[1]
      }
      return ret
    })(),
    file: (a.pathname.match(/\/([^/?#]+)$/i) || [''])[1],
    hash: a.hash.replace('#', ''),
    path: a.pathname.replace(/^([^/])/, '/$1'),
    relative: (a.href.match(/tps?:\/\/[^/]+(.+)/) || [''])[1],
    segments: a.pathname.replace(/^\//, '').split('/')
  }
}

export default parseURL