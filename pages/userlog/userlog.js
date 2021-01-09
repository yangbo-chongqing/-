// pages/userlog/userlog.js
//获取应用实例
const app = getApp()
var http = require('../../utils/httputils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      bgColor: '#ffffff',
      fontColor: '#000',
      title: '用户行为轨迹',
      logo: ''
    },// 此页面 页面内容距最顶部的距离
    height: app.globalData.height,
    axis:'',
    userinfo:'',
    muse_id:'',
    user_id:''
  },
  getData() {
    var prams = {
      muse_id: this.data.muse_id,
      user_id: this.data.user_id
    }
    http.postRequest("/api/Home/UserTrack", prams,
      (res) => {
          if(res.status==200){
            this.setData({
              axis:res.data.data,
              userinfo:res.data.user_info
            })
          }
      },
      function (err) {

      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      muse_id:options.muse_id,
      user_id:options.user_id
    })


    this.getData();
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