exports = window
exports.RCD = exports.RCD || {}
exports.RCD.init = {
  ua: navigator.userAgent.toLowerCase(),
  isRCD: !1,
  isIOS: !1,
  isAndroid: !1,
  isMobile: !1,
  isWX: !1,
  version: 0,
  getAppPlatform: function () {
    if(RCD.init.isRCD && RCD.init.isAndroid) {
      return 'Android';
    }else if(RCD.init.isRCD && RCD.init.isIOS) {
      return 'iPhone'
    } else {
      return 'Wap'
    }
  },
  getBrowserInfo: function () {
    var e = this.ua
    var t = e.match('rcd/(.*)')
    this.isRCD = e.indexOf('rcd') > 0,
    this.version = this.isRCD ? t[1].replace(/(\s.*)|(\.)/g, '') : 0,
    this.version =  this.version.length === 2 ? this.version + '0' : this.version
    this.isAndroid = e.indexOf('android/') > 0,
    this.isIOS = e.indexOf('iphone/') > 0,
    this.isWX = e.indexOf('micromessenger') > 0,
    this.isMobile = this.isAndroid || this.isIOS
  }
}

window.RCD.init.getBrowserInfo()

// 触发请求获取Token
exports.fetchToken = function () {
  // 创建触发事件的方式在Android上不能应用。
  var t = document.getElementById('fetchToken')
  try {
    var o = document.createEvent('Event')
    o.initEvent('click', !0, !0)
    t.dispatchEvent(o)
  } catch (e) {
    console.log(e)
  }
}

// 触发请求获取Token
exports.loginSuccess = function () {
  // 创建触发事件的方式在Android上不能应用。
  var t = document.getElementById('loginSuccess')
  try {
    var o = document.createEvent('Event')
    o.initEvent('click', !0, !0)
    t.dispatchEvent(o)
  } catch (e) {
    console.log(e)
  }
}

// 触发请求获取appInfo
exports.fetchAppInfo = function () {
  // 创建触发事件的方式在Android上不能应用。
  var t = document.getElementById('fetchAppInfo')
  try {
    var o = document.createEvent('Event')
    o.initEvent('click', !0, !0)
    t.dispatchEvent(o)
  } catch (e) {
    console.log(e)
  }
}

// 触发请求获取红包领取成功回调信息
exports.getCouponsSuccess = function () {
  // 创建触发事件的方式在Android上不能应用。
  var t = document.getElementById('getCouponsSuccess')
  try {
    var o = document.createEvent('Event')
    o.initEvent('click', !0, !0)
    t.dispatchEvent(o)
  } catch (e) {
    console.log(e)
  }
}

// iso 老版本调取方法
exports.appLoginSuccess = function (e) {
  window.RCD.access_token = e
}

// iso 新版本调取方法
exports.fetchAppInfoSuccess = function (json) {
  var jsonInfo = JSON.parse(json)
  window.RCD.access_token = jsonInfo.access_token
  window.RCD.download_channel = jsonInfo.download_channel
  window.RCD.utm_source = jsonInfo.utm_source
  window.RCD.distinct_Id = jsonInfo.distinct_id
  window.RCD.platform = jsonInfo.platform
  window.RCD.logined = jsonInfo.logined
  window.RCD.client_id = jsonInfo.client_id
}

RCD.init.isRCD && RCD.init.isIOS && (parseInt(RCD.init.version) > 330) && window.fetchAppInfo()
!RCD.access_token && RCD.init.isRCD && RCD.init.isIOS && (parseInt(RCD.init.version) >= 320) && (parseInt(RCD.init.version) <= 330) && window.fetchToken()
if (!RCD.access_token && RCD.init.isRCD && RCD.init.isAndroid) {
 //Android版本号不同，调用不同的触发方法
 if (parseInt(RCD.init.version) > 330) {
   var jsonInfo = JSON.parse(window.rcdAndroid.fetchAppInfo())
   window.RCD.access_token = jsonInfo.access_token
   window.RCD.download_channel = jsonInfo.download_channel
   window.RCD.utm_source = jsonInfo.utm_source
   window.RCD.distinct_Id = jsonInfo.distinct_id
   window.RCD.platform = jsonInfo.platform
   window.RCD.logined = jsonInfo.logined
   window.RCD.client_id = jsonInfo.client_id
 }

 if (parseInt(RCD.init.version) >= 320 && parseInt(RCD.init.version) <= 330) {
   window.RCD.access_token = window.rcdAndroid.getToken()
 }
}
