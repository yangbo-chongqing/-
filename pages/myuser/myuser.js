//获取应用实例
const app = getApp()
var http = require('../../utils/httputils.js');
Page({
  data: {
    // 组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '寻声扫码', //导航栏 中间的标题
      bgColor:'',
      
      fontColor:'#000000'
    },
    userInfo: {},
    hasUserInfo: false,
    session_key: '',
    token: '',
    user: '',
    phone:'',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height,
    is_get_phone: false
  },
  getUserInfo(){
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  
  onLoad: function () {
    if(!wx.getStorageSync("token")){
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  onShow(){
    
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        console.log(res);
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onShareTimeline(res) {
    
  },
  onShareAppMessage: function (ops) {
    
  },
  onPageScroll(scroll){
    if(scroll.scrollTop<100){
      this.setData({
        'nvabarData.bgColor':'',
        "nvabarData.fontColor":"#ffffff"
      })
    }
    if(scroll.scrollTop>100 && scroll.scrollTop<110 && scroll.scrollTop<110){
      this.setData({
        'nvabarData.bgColor':'rgba(255,255,255,0.1)',
      })
    }else if(scroll.scrollTop>110  && scroll.scrollTop<120){
      this.setData({
        'nvabarData.bgColor':'rgba(255,255,255,0.2)',
        "nvabarData.fontColor":"#000000"
      })
    }
    else if(scroll.scrollTop>120  && scroll.scrollTop<130){
      this.setData({
        'nvabarData.bgColor':'rgba(255,255,255,0.4)'
      })
    }
    else if(scroll.scrollTop>130 && scroll.scrollTop<140){
      this.setData({
        'nvabarData.bgColor':'rgba(255,255,255,0.6)'
      })
    }
    else if(scroll.scrollTop>140){
      this.setData({
        'nvabarData.bgColor':'rgba(255,255,255,1)'
      })
    }
    
  },
})