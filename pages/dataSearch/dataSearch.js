// pages/dataList/dataList.js
const app = getApp()
var http = require('../../utils/httputils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '', //导航栏 中间的标题
      bgColor:'',
      fontColor:'#ffffff'
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height,
    type_id:'',
    muse_id:'',
    keyword:'',
    value: '',
    datalist:[]
  },
  onChange(e) {
    this.setData({
      keyword: e.detail,
    });
    console.log(this.data.value);
  },
  onSearch() {
    if (this.data.keyword.trim() == '') {
      return false;
    }
    this.getDataList();
  },
  getDataList() {
    var prams = {
      type_id:this.data.type_id,
      muse_id:app.globalData.muse_id,
      keyword:this.data.keyword
    }
    http.postRequest("/api/Home/RelicsList", prams,
      (res)=> {
        this.setData({
          datalist:res.data
        })
      },
      function (err) {

      })
  },
  //跳转详情
  openJump(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/apprecinfo/apprecinfo?id='+id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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