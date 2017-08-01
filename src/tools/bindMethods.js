// 判断浏览器
export function browserType () {
  let ua = navigator.userAgent.toLowerCase()
  if (ua.match(/MicroMessenger/i)) {
    return 'weChat'
  }
  if (ua.match(/AlipayClient/i)) {
    return 'alipay'
  }
}
