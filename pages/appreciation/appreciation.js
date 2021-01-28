//获取应用实例
const app = getApp()
var http = require('../../utils/httputils.js');
Page({
  data: {
    // 组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      isHome: true, //是否显示home按钮
      isSearch: true,
      title: '',
      bgColor: '',
      fontColor: '#ffffff'
    },
    videoObj: {
      videoUrl: '',
      poster: "",
      videoTitle: "",
      videoText: ""
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height,
    homeData: [],
    homeInfo: '',
    value: '',
    muse_id: '',
    myaudio: '',
    playFlag: true,
    videoContext: '',
    videoFlag: true,
  },
  onPageScroll(scroll) {
    if (scroll.scrollTop < 60) {
      this.setData({
        'nvabarData.bgColor': '',
        "nvabarData.fontColor": "#ffffff",
        "nvabarData.title": ''
      })
    }
    if (scroll.scrollTop > 100 && scroll.scrollTop < 60 && scroll.scrollTop < 70) {
      this.setData({
        'nvabarData.bgColor': 'rgba(255,255,255,0.1)',
        "nvabarData.fontColor": "#000000",
        "nvabarData.title": this.data.homeInfo.muse_name
      })
    } else if (scroll.scrollTop > 70 && scroll.scrollTop < 80) {
      this.setData({
        'nvabarData.bgColor': 'rgba(255,255,255,0.2)',
        "nvabarData.fontColor": "#000000",
        "nvabarData.title": this.data.homeInfo.muse_name
      })
    } else if (scroll.scrollTop > 80 && scroll.scrollTop < 90) {
      this.setData({
        'nvabarData.bgColor': 'rgba(255,255,255,0.4)',
        "nvabarData.fontColor": "#000000",
        "nvabarData.title": this.data.homeInfo.muse_name
      })
    } else if (scroll.scrollTop > 90 && scroll.scrollTop < 100) {
      this.setData({
        'nvabarData.bgColor': 'rgba(255,255,255,0.6)',
        "nvabarData.fontColor": "#000000",
        "nvabarData.title": this.data.homeInfo.muse_name
      })
    } else if (scroll.scrollTop > 100) {
      this.setData({
        'nvabarData.bgColor': 'rgba(255,255,255,1)',
        "nvabarData.fontColor": "#000000",
        "nvabarData.title": this.data.homeInfo.muse_name
      })
    }

  },
  onShareTimeline: function () {
		return {
	      title: this.data.homeInfo.muse_name,
	      query: {
	        muse_id: app.globalData.muse_id
	      },
        imageUrl: this.data.homeInfo.logo
	    }
	},
  onShareAppMessage: function (ops) {
    return {
      title: this.data.homeInfo.muse_name,
      imageUrl: this.data.homeInfo.logo,
      path:"/pages/appreciation/appreciation?muse_id="+app.globalData.muse_id
    }
  },
  videoPause(e) {
    if (e.type == 'play') {
      this.setData({
        videoFlag: false
      })
    }

  },
  getHomeData() {
    var prams = {
      muse_id: app.globalData.muse_id
    }
    http.postRequest("/api/Home/MuseIndex", prams,
      (res) => {
        let videoObj = {};
        if (res.data.info.video_url) {
          videoObj = {
            videoUrl: res.data.info.video_url,
            poster: `${res.data.info.video_url}?vframe/jpg/offset/0/w/420/h300`,
            videoTitle: res.data.info.muse_name,
            videoText: res.data.info.address
          }
        }
        res.data.list.map((item) => {
          item.titles = {
            id: item.id,
            title: item.type_name,
            ishflag: item.display == 0 ? true : false,
            type: item.display == 0 ? 'more' : 'hyh'
          }
        })
        this.setData({
          homeData: res.data.list,
          homeInfo: res.data.info,
          videoObj: videoObj,
        })
      },
      function (err) {

      })
  },
  onChange(e) {
    this.setData({
      value: e.detail,
    });
  },
  onSearch() {
    if (this.data.value.trim() == '') {
      return false;
    }
    wx.navigateTo({
      url: '/pages/dataList/dataList?keyword=' + this.data.value,
    })
  },
  playVideo() {
    this.data.videoContext = wx.createVideoContext('myVideo');
    if (this.data.videoFlag) {
      this.data.videoContext.play();
    } else {
      this.data.videoContext.pause();
    }
    this.setData({
      videoFlag: !this.data.videoFlag
    })
    this.data.myaudio.pause();
  },
  playAudio(e) {
    this.data.videoContext = wx.createVideoContext('myVideo');
    this.data.videoContext.pause();
    this.setData({
      videoFlag: true
    })
    if (this.data.playFlag) { //初始化给backgroundAudioManager.src赋值
      this.data.myaudio.src = this.data.homeInfo.voice_url;
      this.data.myaudio.title = this.data.homeInfo.muse_name;
    } else {
      this.data.myaudio.pause();
    }
    this.setData({
      playFlag: !this.data.playFlag
    })
  },
  onLoad: function (opts) {
    if (opts.muse_id) {
      app.globalData.muse_id = opts.muse_id
    }
    this.getHomeData();
    this.data.myaudio = wx.getBackgroundAudioManager();
    this.data.myaudio.onPlay(() => {
      this.setData({
        playFlag: false,
      })
    })
    this.data.myaudio.onPause(() => {
      this.setData({
        playFlag: true,
      })
    })
    this.data.myaudio.onStop(() => {
      this.setData({
        playFlag: true,
      })
    })
    this.data.myaudio.onEnded(() => {
      this.setData({
        playFlag: true,
      })
    })
  },
  onHide() {
    this.data.myaudio.stop();
  }
})