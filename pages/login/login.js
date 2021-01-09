const app = getApp()
var http = require('../../utils/httputils.js');
Page({
  data: {
    session_key: '',
    token: '',
    user: '',
    phone:'',
    is_get_phone: false
  },
  back(){
    wx.navigateBack();
  },
  getUserInfo: function (e) {
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      let user = {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      }
      this.setData({
        token:wx.getStorageSync("token").token,
        user: user
      })
      this.loginreqs(1);
      // if (!app.globalData.is_tel) {
      //   this.setData({
      //     is_get_phone: true
      //   })
      // }else{
      //   this.loginreqs(1);
      // }
    }
  },
  getPhoneNumber: function (e) {
    var that = this;
    let phone = {
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv,
    }
    this.setData({
      phone:phone
    })
    this.loginreqs(2);
  },
  loginreqs(type){
    let prams = {
      requestData:{
        user: this.data.user,
      },
      token: this.data.token
    }
    if(type == 2){
      prams.requestData.phone=this.data.phone
    }
    prams.requestData = JSON.stringify(prams.requestData);
    http.postRequest("/api/LoginUser", prams,
      (res) => {
        // if(res.status==300){
        //   this.getUserInfo();
        // }
        wx.setStorage({
          data: {
            token:res.data.token,
            user_id:res.data.user_id
          },
          key: 'token',
        })
        app.globalData.is_tel = true;
        app.globalData.is_authorize = true;
        this.setData({
          is_get_phone: false
        })
        this.back();
      },
      (err) => {
        this.setData({
          is_get_phone: false
        })
        this.back();
      })
  },
  onLoad(){
    
  },
  // 打开权限设置页提示框  取消授权走这里
  showSettingToast: function(e) {
    // wx.showModal({
    //   title: '提示！',
    //   confirmText: '去设置',
    //   showCancel: false,
    //   content: e,
    //   success: function(res) {
    //     if (res.confirm) {
    //       wx.navigateTo({
    //         url: '../setting/setting',
    //       })
    //     }
    //   }
    // })
  },
})