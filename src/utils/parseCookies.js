module.exports = function parseCookies (cookirStr) {
  let list = {}
  cookirStr && cookirStr.split(';').forEach(function (cookie) {
    let parts = cookie.split('=')
    list[parts.shift().trim()] = decodeURI(parts.join('='))
  })
  return list
}
