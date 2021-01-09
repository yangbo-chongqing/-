// pages/code/code.js
const app = getApp()
var http = require('../../utils/httputils.js');
var utils = require('../../utils/util.js');
import Toast from '@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    key: '',
    token:'',
    user: '',
    phone:'',
    text:'将使用微信登录寻声地图',
    login_content:'登录',
    cancel_content:'取消登录',
    authorized_login:'授权登录',
    showView:'',
    data_index:'',
  },
  back(){
    wx.navigateBack();
  },
 //点击登录
  login(e){
    let t= this;
    let state = e.currentTarget.dataset['index'];
    let data ={
      'key':this.data.key,
      "state":state,
    }
    http.postRequest("/api/store/authorization", data, (res) => {
      console.log(res)
        if(res.message == '操作成功'){
          if(state==1){
            Toast({
              type: 'success',
              message: '登录成功',
              onClose: () => {
                wx.switchTab({
                  url: '/pages/index/index',
                })
              },
            });
          }else{
            Toast({
              type: 'success',
              message: '已取消',
              onClose: () => {
                wx.switchTab({
                  url: '/pages/index/index',
                })
              },
            });
          }
         
        }else{
          Toast.fail(res.message);s
        }
    },(err) => {
      console.log(err)
    })
  },
  //获取微信授权
  getPhoneNumber: function (e) {
    this.data.data_index=e;
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
        this. login(this.data.data_index);
      },
      (err) => {
        this.setData({
          is_get_phone: false
        })
        // this. login(this.data.data_index);
      })
  },
  //验证二维码是否过期
  beOverdue(){
    let t= this;
    let prams ={
      'key':this.data.key
    };
    http.postRequest("/api/store/mini/credentials", prams, (res) => {
      console.log(res)
      if(res.message == '获取信息成功'){
        t.setData({
          text: '将使用微信登录寻声地图',
          login_content : '登录',
          authorized_login:'授权登录',
          cancel_content :'取消登录',
        })
      }else{
        t.setData({
          text: '二维码过期,请重新刷新页面',
          login_content : '',
          cancel_content :'',
          authorized_login:'',
        })
      }
    },(err) => {
      console.log(err);
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.key=(options.key)
    // console.log(this.data.key)
    //检查是否为新用户
    utils.verifyToken((res) => {
      console.log(res)
      this.data.showView = res.data.is_tel;
      this.data.token = res.data.token;
      this.beOverdue();
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})