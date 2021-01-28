//获取应用实例
const app = getApp()
//引入解析富文本HTML
var WxParse = require('../../utils/wxParse/wxParse.js');
var http = require('../../utils/httputils.js');
var time = require('../../utils/util.js');
let myaudio = null;
var that = undefined;
Page({
  data: {
    // 组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      bgColor: '#ffffff',
      fontColor: '#000000',
      title: ''
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height,
    videoObj: '',
    audioObj: '',
    relics_id: '',
    relicsInfo: [],
    videoFlag: true,
    videoContext: '',
    openTap: true,
    myaudio: '',
    currentValue: 50,
    playFlag: true,
    currentTime: 0,
    duration: 0,
    prossMax: 100,
    prossnum: 0,
    viewStyle: '',
    doommData: [],
    arr: [],
    userinfo: '',
    page:1,
    page_size:10,
    pageFlag:true
  },
  trim(s) {
    return s.replace(/(^\s*)|(\s*$)/g, "");
  },
  wxParseTagATap(e) {
    let httpUrl = e.currentTarget.dataset.src;
    wx.navigateTo({
      url: httpUrl,
    })
  },
  //查询数据
  scrollgetdata(){
    this.getrelicsInfo();
  },
  jumpinfo(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/apprecinfoys/apprecinfoys?id='+id,
    })
  },
  getrelicsInfo() {
    if(this.data.pageFlag){
      let that = this;
      var prams = {
        relics_id: this.data.relics_id,
        page_size:this.data.page_size,
        page:this.data.page,
      }
      http.postRequest("/api/Home/History", prams,
        (res) => {
          if (res.data.history_list.length > 0) {
            res.data.history_list.map((item, index) => {
              item.playFlag = true;
            })
          }
          let arr = this.data.relicsInfo.concat(res.data.history_list);
          this.setData({
            relicsInfo: arr,
            'nvabarData.title':res.data.title
          })
          if(res.data.history_list.length<this.data.page_size){
            this.setData({
              pageFlag:false
            })
          }else{
            this.data.page++
          }
        },
        function (err) {
  
        })
    }
    
  },
  
  playAudioList(e) {
    let index = e.currentTarget.dataset.index;
    this.data.relicsInfo.map((item, i) => {
      if (index != i) {
        let audioCtxs = wx.createAudioContext('myAudio' + i);
        audioCtxs.pause();
        item.playFlag = true;
      }
    })
    this.setData({
      relicsInfo: this.data.relicsInfo
    })
    let audioCtx = wx.createAudioContext('myAudio' + index);
    if (this.data.relicsInfo[index].playFlag) {
      audioCtx.play();
    } else {
      audioCtx.pause();
    }
    let flag = `relicsInfo[${index}].playFlag`;
    this.setData({
      [flag]: !this.data.relicsInfo[index].playFlag
    })
  },
  onLoad: function (opt) {
    this.setData({
      relics_id: opt.id,
    })
    this.getrelicsInfo();

  },
  onShow() {
  },
  onHide() {
   
  },
  onUnload() {
  },
  onShareTimeline(res) {

  },
  onShareAppMessage: function (ops) {

  },
})