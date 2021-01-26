//app.js
var http = require('/utils/httputils.js');
App({
  onLaunch: function (options) {
    this.globalData.scene = options.scene
    //获取设备顶部窗口的高度（不同设备窗口高度不一样，根据这个来设置自定义导航栏的高度）
    this.globalData.height = wx.getSystemInfoSync()['statusBarHeight']
  },
  globalData: {
    is_authorize:false,
    is_tel:false,
    userInfo: null,
    share: false, // 分享默认为false
    height: 0,
    muse_id: 1,
    scene:0
  },
})
