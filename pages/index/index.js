//index.js
//获取应用实例
const app = getApp()
var http = require('../../utils/httputils.js');
Page({
  data: {
    // 组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '寻声地图', //导航栏 中间的标题
      bgColor:'#ffffff',
      isHomeFlag:true,
      fontColor:'#000000',
      isSearch:true
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height,
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    homeData:'',
    tabIndex:0,
    fixedNav:false
  },
  //选项卡切换
  toggleTab(e){
    let index =e.currentTarget.dataset.index;
    this.setData({
      tabIndex:index
    })
  },
  getHomeData() {
    var prams = {}
    http.postRequest("/api/Home", prams,
      (res)=> {
        this.setData({
          homeData:res.data
        })
      },
      function (err) {

      })
  },
  jumpLink(e){
    let linkUrl = e.currentTarget.dataset.link;
    wx.navigateTo({
      url: linkUrl,
    })
  },
  openUrl(e){
    let id = e.currentTarget.dataset.id;
    app.globalData.muse_id = id;
    wx.navigateTo({
      url: '/pages/appreciation/appreciation'
    })
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  openJump(){
    wx.navigateTo({
      url: '/pages/dataSearchcart/dataSearchcart?type=more',
    })
  },
  onPageScroll(e){
    // let  scrollTop=e.scrollTop
    // let query = wx.createSelectorQuery()
    // query.select('#index-nav').boundingClientRect( (rect) => {
    //     let top = rect.top
    //     if (top <= 53) {  //临界值，根据自己的需求来调整
    //         this.setData({
    //             fixedNav: true,    //是否固定导航栏
    //         })
    //     } else {
    //         this.setData({
    //             fixedNav: false,
    //         })
    //     }
    // }).exec()
  },
  onLoad: function () {
    this.getHomeData();
  },
  onShareTimeline(res) {
    
  },
  onShareAppMessage: function (ops) {
    
  },
})