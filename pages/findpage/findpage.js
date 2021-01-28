//获取应用实例
const app = getApp()
var http = require('../../utils/httputils.js');
Page({
  data: {
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '', //导航栏 中间的标题
      bgColor:'',
      fontColor:'#ffffff'
    },
    titleObj: {
      title: "",
      ishflag: true,
      type: "hyh"
    },
    titleObj1: {
      title: "",
      ishflag: true,
      type: "hyh"
    },
    height: app.globalData.height,
    value: '',
    findData:[],
  },
  getFindList() {
    var prams = {
      muse_id:app.globalData.muse_id
    }
    http.postRequest("/api/Home/MuseFind", prams,
      (res)=> {
        res.data.list.map((item)=>{
          let title ={
            title: item.type_name,
            ishflag: true,
            type: "hyh"
          }
          item.title = title;
        })
        this.setData({
          findData:res.data,
          "titleObj.title":res.data.recommend.title,
          "titleObj1.title":res.data.recommend.title
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
  //跳转列表
  openJumpData(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/dataList/dataList?type_id='+id,
    })
  },
  onChange(e) {
    this.setData({
      value: e.detail,
    });
    console.log(this.data.value);
  },
  onSearch() {
    if (this.data.value.trim() == '') {
      return false;
    }
    wx.navigateTo({
      url: '/pages/dataList/dataList?keyword=' + this.data.value,
    })
  },
  onLoad: function () {
    this.getFindList();
    //获取当前定位
    // wx.getLocation({
    //   type: "wgs84",
    //   success(res) {
    //     console.log(res)
    //   }
    // })
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