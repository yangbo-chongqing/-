//获取应用实例
const app = getApp()
//引入解析富文本HTML
var WxParse = require('../../utils/wxParse/wxParse.js');
var http = require('../../utils/httputils.js');
var utils = require('../../utils/util.js');
const recorderManager = wx.getRecorderManager()
let myaudio = null;
var that = undefined;
var doommList = [];
var i = 0;
var ids = 0;
var cycle = null //计时器
// 弹幕参数
class Doomm {
  constructor(text, top, time, color) { //内容，顶部距离，运行时间，颜色（参数可自定义增加）
    this.text = text;
    this.top = top;
    this.time = time;
    this.color = color;
    this.display = true;
    this.id = i++;
  }
}
// 弹幕字体颜色
function getRandomColor() {
  let rgb = []
  for (let i = 0; i < 3; ++i) {
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length == 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
}
Page({
  data: {
    // 组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      bgColor: '',
      fontColor: '#ffffff',
      title: '',
      logo: ''
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
    placeholder: '请输入评论',
    autoFocus: false,
    plShow: false,
    lyFlag: 0,
    relics_id: '',
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height,
    reply_id: '',
    comment: '',
    image: [],
    voice: '',
    commentList: [],
    plpage: 1,
    plpage_size: 10,
    is_getListFlag: true,
    timeNumber: '00:00',
    plduration: 0,
    hfIndex: '',
    plmyaudio: '',
    playFlag: true,
    savevoice: '',
    isUserFlag: false,
    inputHeight: 0,
    timeout: '',
    stay: 0//页面停留时长
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
  //切换内容显示隐藏
  // toggleTap(){
  //   this.setData({
  //     toggleTap:!this.data.toggleTap
  //   })
  // },
  //点赞
  linkFn() {
    let that = this;
    var prams = {
      relics_id: this.data.relics_id
    }
    http.postRequest("/api/Home/RelicsLike", prams,
      (res) => {
        wx.showToast({
          title: res.message,
        })
        if (this.data.relicsInfo.info.is_like == 0) {
          that.setData({
            'relicsInfo.info.is_like': 1,
            'relicsInfo.info.likes': this.data.relicsInfo.info.likes + 1
          })
        }

      },
      function (err) {

      })
  },
  getrelicsInfo() {
    let that = this;
    var prams = {
      relics_id: this.data.relics_id
    }
    http.postRequest("/api/Home/RelicsInfo", prams,
      (res) => {
        if (res.data.info.muse_id) {
          app.globalData.muse_id = res.data.info.muse_id;
        } else {
          app.globalData.muse_id = 1;
        }
        if (res.data.info.history_list.length > 0) {
          res.data.info.history_list.map((item, index) => {
            item.playFlag = true;
          })
        }
        let videoObj = {
          videoUrl: res.data.info.video_url,
          poster: `${res.data.info.video_url}?vframe/jpg/offset/0/w/420/h300`,
          videoTitle: res.data.info.name,
          videogk: `${res.data.info.watch_number}人已观看`,
        }
        let audioObj = {};
        if (res.data.info.voice_url) {
          audioObj = {
            audioImg: res.data.info.image,
            name: res.data.info.name,
            author: res.data.info.name,
            currentTime: 0,
            duration: res.data.info.duration,
            src: res.data.info.voice_url,
          }
        }
        if (res.data.comment_list.length > 0) {
          let arr1 = []
          res.data.comment_list.map((item) => {
            arr1.push(item.comment);
          })
          this.setData({
            arr: arr1
          })
        }
        res.data.info.content = this.trim(res.data.info.content);
        this.setData({
          relicsInfo: res.data,
          videoObj: videoObj,
          audioObj: audioObj
        })
        wx.setNavigationBarTitle({
          title: res.data.info.name,
        })
        if (audioObj.src) {
          // this.creatAudio();
          let myaudio = wx.createAudioContext('myaudiof')
          myaudio.play();
          this.setData({
            playFlag: false
          })
        }
        if (res.data.info.content) {
          var article = res.data.info.content;
          WxParse.wxParse('article', 'html', article, that, 5);
        }


      },
      function (err) {

      })
  },
  openView() {
    if (this.data.viewStyle == '') {
      this.setData({
        viewStyle: 'auto'
      })
    } else {
      this.setData({
        viewStyle: ''
      })
    }

  },
  myvideopause(e) {
    this.setData({
      videoFlag: true
    })
  },
  videoPause(e) {
    if (e.type == 'play') {
      this.setData({
        videoFlag: false
      })
      let myaudio = wx.createAudioContext('myaudiof')
      myaudio.pause();
      this.setData({
        playFlag: true
      })
    }
  },
  myaudiofend() {
    let myaudio = wx.createAudioContext('myaudiof')
    this.setData({
      playFlag: true
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
    this.data.plmyaudio.pause();
    if (this.data.relicsInfo.info.history_list.length > 0) {
      this.data.relicsInfo.info.history_list.map((item, i) => {
        let audioCtxs = wx.createAudioContext('myAudio' + i);
        audioCtxs.pause();
        item.playFlag = true;
      })
      this.setData({
        relicsInfo: this.data.relicsInfo
      })
    }
    let myaudio = wx.createAudioContext('myaudiof');
    myaudio.pause();
  },
  playAudio(e) {
    this.data.videoContext = wx.createVideoContext('myVideo');
    this.data.videoContext.pause();
    this.setData({
      videoFlag: true
    })
    let myaudio = wx.createAudioContext('myaudiof')
    if (this.data.playFlag) { //初始化给backgroundAudioManager.src赋值
      myaudio.play();
    } else {
      myaudio.pause();
    }
    this.setData({
      playFlag: !this.data.playFlag
    })
  },
  playAudioList(e) {
    let index = e.currentTarget.dataset.index;
    let myaudio = wx.createAudioContext('myaudiof');
    myaudio.pause();
    this.setData({
      videoFlag: true
    })
    this.data.videoContext = wx.createVideoContext('myVideo');
    this.data.videoContext.pause();
    this.data.relicsInfo.info.history_list.map((item, i) => {
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
    if (this.data.relicsInfo.info.history_list[index].playFlag) {
      audioCtx.play();
    } else {
      audioCtx.pause();
    }
    let flag = `relicsInfo.info.history_list[${index}].playFlag`;
    this.setData({
      [flag]: !this.data.relicsInfo.info.history_list[index].playFlag
    })
  },
  proChange(e) {
    myaudio.seek(e.detail)
    let currentTime = utils.formateSeconds(myaudio.currentTime, 1);
    let duration = utils.formateSeconds(myaudio.duration, 1);
    this.setData({
      prossMax: myaudio.duration,
      currentTime: currentTime,
      duration: duration,
      prossnum: myaudio.currentTime
    })
  },
  proDrag() {
    myaudio.pause();
  },
  proDragEnd() {
    myaudio.play();
  },
  plplayAudio(e) {
    let myaudio = wx.createAudioContext('myaudiof');
    myaudio.pause();
    this.setData({
      videoFlag: true
    })
    this.data.videoContext = wx.createVideoContext('myVideo');
    this.data.videoContext.pause();
    this.data.relicsInfo.info.history_list.map((item, i) => {
      let audioCtxs = wx.createAudioContext('myAudio' + i);
      audioCtxs.pause();
      item.playFlag = true;
    })
    this.setData({
      relicsInfo: this.data.relicsInfo
    })
    let voice_url = e.currentTarget.dataset.voice;
    if (this.data.plmyaudio.paused || this.data.plmyaudio.paused == undefined || this.data.savevoice != voice_url) {
      this.setData({
        savevoice: voice_url
      })
      this.data.plmyaudio.src = voice_url;
      this.data.plmyaudio.title = '音频播放';
    } else {
      this.data.plmyaudio.pause();
    }
  },
  formatBit(val) {
    val = +val
    return val > 9 ? val : '0' + val
  },
  formatSeconds(time) {
    let min = Math.floor(time % 3600)
    let val = this.formatBit(Math.floor(min / 60)) + ':' + this.formatBit(time % 60)
    return val
  },
  // 定时器
  minReturn() {
    let time = 0
    let t = setInterval(() => {
      time++;
      this.setData({
        plduration: time,
        timeNumber: this.formatSeconds(time)
      })
      if (this.data.lyFlag == 0) {
        this.setData({
          timeNumber: 0
        })
        clearInterval(t)
      }
    }, 1000)
  },
  startLy() {
    this.setData({
      lyFlag: 1
    })
    const options = {
      duration: 300000, //指定录音的时长，单位 ms
      sampleRate: 16000, //采样率
      encodeBitRate: 96000, //编码码率
      format: 'mp3', //音频格式，有效值 aac/mp3
      frameSize: 50, //指定帧大小，单位 KB
    }
    //开始录音
    recorderManager.start(options);
    recorderManager.onStart(() => {
      this.minReturn();
    });
    //错误回调
    recorderManager.onError((res) => {
    })
  },
  endLy() {
    let that = this;
    that.setData({
      lyFlag: 0,
      plShow: false
    })
    recorderManager.stop();
    recorderManager.onStop((res) => {
      wx.uploadFile({
        url: 'https://xsdt.xunsheng.org.cn/api/UploadFile',
        header: {
          'Authorization': "Bearer " + JSON.stringify(wx.getStorageSync("token"))
        },
        filePath: res.tempFilePath,
        name: 'file',
        success(res) {
          let data = JSON.parse(res.data)
          that.setData({
            voice: data.data.file_path,
            plShow: false
          })
          that.RelicsSubmit();
        }
      })
    })
  },
  //评论文字
  RelicsComment(e) {
    this.setData({
      comment: e.detail.value
    })
    if (!app.globalData.is_authorize) {
      this.setData({
        isUserFlag: true
      })
    } else {
      this.setData({
        isUserFlag: false
      })
    }
    if (this.data.isUserFlag) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return false;
    }
    this.RelicsSubmit();
  },
  //特殊转化分秒
  formate(endTime) {
    let secondTime = parseInt(endTime); //将传入的秒的值转化为Number
    let min = parseInt(secondTime / 60); //获取分钟，除以60取整数，得到整数分钟
    secondTime = parseInt(secondTime % 60); //获取秒数，秒数取佘，得到整数秒数
    return min + "'" + secondTime + '"';
  },
  //提交评论
  RelicsSubmit(e) {
    let parmas = {
      relics_id: this.data.relics_id,
      reply_id: this.data.reply_id,
      comment: this.data.comment,
      image: this.data.image.toString(),
      voice: this.data.voice,
      duration: this.data.plduration
    }
    http.postRequest("/api/Home/RelicsComment", parmas,
      (res) => {
        wx.showToast({
          title: res.message,
        })
        let arr = this.data.commentList;
        res.data.info.duration = this.formate(res.data.info.duration);
        if (this.data.reply_id) {
          arr[this.data.hfIndex].list.unshift(res.data.info);
        } else {
          arr.unshift(res.data.info)
        }
        this.setData({
          comment: '',
          reply_id: '',
          image: [],
          voice: '',
          hfIndex: '',
          commentList: arr,
          plduration: 0,
        })
      },
      function (err) {

      })
  },
  //数组去重
  unique(arr) {
    const res = new Map();
    return arr.filter((arr) => !res.has(arr.id) && res.set(arr.id, 1));
  },
  //记录用户停留时长
  track() {
    let parmas = {
      muse_id: app.globalData.muse_id,
      routing: '/pages/apprecinfo/apprecinfo',
      stay: this.data.stay,
      relics_id: this.data.relics_id,
    }
    http.postRequest("/api/Home/Track", parmas,
      (res) => {

      },
      function (err) {

      })
  },
  //扫码进入调用接口用户行为给管理员发送推送
  sendScanCode() {
    let parmas = {
      relics_id: this.data.relics_id,
    }
    http.postRequest("/api/Home/ScanCode", parmas,
      (res) => {

      },
      function (err) {

      })


  },

  //评论列表
  RelicsCommentList() {
    if (this.data.is_getListFlag) {
      let parmas = {
        page: this.data.plpage,
        page_size: this.data.plpage_size,
        relics_id: this.data.relics_id,
        reply_id: this.data.reply_id
      }
      http.postRequest("/api/Home/RelicsCommentList", parmas,
        (res) => {
          wx.setNavigationBarTitle({
            title: `全部${res.data.comment_count}条评论`,
          })
          let arr = this.data.commentList.concat(res.data.list);
          arr = this.unique(arr);

          arr.map((item) => {
            item.duration = this.formate(item.duration);
          })
          this.setData({
            commentList: arr
          })
          if (res.data.list.length < this.data.plpage_size) {
            this.setData({
              is_getListFlag: false
            })
          } else {
            this.setData({
              plpage: this.data.plpage + 1
            })
          }
        },
        function (err) {

        })
    }
  },
  CommentLike(e) {
    if (!app.globalData.is_authorize) {
      this.setData({
        isUserFlag: true
      })
    } else {
      this.setData({
        isUserFlag: false
      })
    }
    if (this.data.isUserFlag) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return false;
    }
    let comment_id = e.currentTarget.dataset.commentid;
    let index = e.currentTarget.dataset.index;
    let itemindex = e.currentTarget.dataset.itemindex
    var prams = {
      comment_id: comment_id
    }
    http.postRequest("/api/Home/CommentLike", prams,
      (res) => {
        wx.showToast({
          title: res.message,
        })
        if (res.status == 200) {
          let arr = this.data.commentList;
          if (itemindex >= 0) {
            arr[index].list[itemindex].likes++;
            arr[index].list[itemindex].is_like = 1;
          }
          else {
            arr[index].likes++;
            arr[index].is_like = 1;
          }
          this.setData({
            commentList: arr
          })
        }
      },
      function (err) {

      })
  },
  //上传图片
  uploadImg() {
    if (!app.globalData.is_authorize) {
      this.setData({
        isUserFlag: true
      })
    } else {
      this.setData({
        isUserFlag: false
      })
    }
    if (this.data.isUserFlag) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return false;
    }
    let that = this;
    wx.chooseImage({
      count: 3,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePaths = res.tempFilePaths;
        for (let i = 0; i < tempFilePaths.length; i++) {
          wx.uploadFile({
            url: 'https://xsdt.xunsheng.org.cn/api/UploadFile',
            header: {
              'Authorization': "Bearer " + JSON.stringify(wx.getStorageSync("token"))
            },
            filePath: tempFilePaths[i],
            name: 'file',
            success(res) {
              let data = JSON.parse(res.data)
              let imgs = that.data.image.concat(data.data.file_path);
              that.setData({
                image: imgs
              })
              if (that.data.image.length == tempFilePaths.length) {
                that.RelicsSubmit();
              }

            }
          })
        }

      }
    })

  },
  //图片预览
  previewMedia(e) {
    let imgs = e.currentTarget.dataset.imgs;
    let index = e.currentTarget.dataset.index;
    wx.previewImage({
      current: imgs[index], // 当前显示图片的http链接
      urls: imgs // 需要预览的图片http链接列表
    })
  },
  isauthor(e) {
    var inputHeight = 0
    if (e.detail.height) {
      inputHeight = e.detail.height
    }
    this.setData({
      inputHeight: inputHeight
    })
    if (!app.globalData.is_authorize) {
      this.setData({
        isUserFlag: true
      })
    } else {
      this.setData({
        isUserFlag: false
      })
    }
    if (this.data.isUserFlag) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return false;
    }

  },
  showPopup() {
    if (!app.globalData.is_authorize) {
      this.setData({
        isUserFlag: true
      })
    } else {
      this.setData({
        isUserFlag: false
      })
    }
    if (this.data.isUserFlag) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return false;
    }
    let myaudio = wx.createAudioContext('myaudiof')
    myaudio.pause();
    this.setData({
      videoFlag: true,
      playFlag: true
    })
    this.data.videoContext = wx.createVideoContext('myVideo');
    this.data.videoContext.pause();
    this.data.relicsInfo.info.history_list.map((item, i) => {
      let audioCtxs = wx.createAudioContext('myAudio' + i);
      audioCtxs.pause();
      item.playFlag = true;
    })
    this.setData({
      relicsInfo: this.data.relicsInfo
    })
    this.setData({
      plShow: true
    });
  },
  onClose() {
    this.setData({
      plShow: false,
      lyFlag: 0
    });
    if (this.data.plduration > 0) {
      that.RelicsSubmit();
    }
  },
  plSetFocus(e) {
    let reply_id = e.currentTarget.dataset.reply_id;
    let username = e.currentTarget.dataset.username;
    let index = e.currentTarget.dataset.index;
    this.setData({
      autoFocus: true,
      reply_id: reply_id,
      placeholder: '回复' + username,

    })
  },
  hfSetFocus(e) {
    let reply_id = e.currentTarget.dataset.reply_id;
    let username = e.currentTarget.dataset.username;
    let index = e.currentTarget.dataset.index;
    this.setData({
      autoFocus: true,
      reply_id: reply_id,
      placeholder: '回复' + username,
      hfIndex: index
    })
  },
  blurInput() {
    this.setData({
      placeholder: '请输入评论',
      inputHeight: 0
    })
  },
  onLoad: function (opt) {
    this.data.plmyaudio = wx.getBackgroundAudioManager();
    this.data.plmyaudio = wx.getBackgroundAudioManager();
    this.setData({
      relics_id: opt.id,
      currentTime: utils.formateSeconds(this.data.currentTime, 1),
      duration: utils.formateSeconds(this.data.duration, 1),
      userinfo: app.globalData.userInfo
    })
    that = this;
    cycle = setInterval(function () {
      let arr = that.data.arr
      if (arr[ids] == undefined) {
        ids = 0
        doommList.push(new Doomm(arr[ids], Math.ceil(Math.random() * 60), 10, getRandomColor()));
        if (doommList.length > 5) { //删除运行过后的dom
          doommList.splice(0, 1)
        }
        that.setData({
          doommData: doommList
        })
        ids++
        if (ids >= arr.length) {
          clearInterval(cycle)
        }
      } else {
        doommList.push(new Doomm(arr[ids], Math.ceil(Math.random() * 60), 5, getRandomColor()));
        if (doommList.length > 5) {
          doommList.splice(0, 1)
        }
        that.setData({
          doommData: doommList
        })
        ids++
        if (ids >= arr.length) {
          clearInterval(cycle)
        }
      }
    }, 1000)
    let scene = app.globalData.scene
    utils.verifyToken(() => {
      this.RelicsCommentList();
      this.getrelicsInfo();
      if (scene == 1011 || scene == 1012 || scene == 1013 || scene == 1047 || scene == 1048 || scene == 1049) {
        this.sendScanCode();
      }
    })


  },
  onShow() {
    if (!app.globalData.is_authorize) {
      this.setData({
        isUserFlag: true
      })
    } else {
      this.setData({
        isUserFlag: false
      })
    }
    this.data.timeout = setInterval(() => {
      this.data.stay++;
    }, 1000);
  },
  onHide() {
    clearInterval(cycle)
    clearInterval(this.data.timeout)
    ids = 0;
    doommList = []
    if (this.data.myaudio) {
      this.data.myaudio.stop();
    }
    this.track();
  },
  onUnload() {
    if (this.data.myaudio) {
      this.data.myaudio.stop();
    }
    clearInterval(cycle)
    clearInterval(this.data.timeout)
    ids = 0;
    doommList = []
    this.track();
  },
  bindbt: function () {
    doommList.push(new Doomm("这是我的弹幕", Math.ceil(Math.random() * 100), Math.ceil(Math.random() * 10), getRandomColor()));
    this.setData({
      doommData: doommList
    })
  },
  //切换数据
  openToggleData(e) {
    let id = e.currentTarget.dataset.id;
    this.data.videoContext = wx.createVideoContext('myVideo');
    this.data.videoContext.pause();
    this.setData({
      videoFlag: true
    })
    wx.navigateTo({
      url: '/pages/apprecinfo/apprecinfo?id=' + id
    })
  },
  jumpList(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/apprecinfoList/apprecinfoList?id=' + id
    })
  },
  openJump() {
    wx.navigateTo({
      url: '/pages/pllist/pllist?id=' + this.data.relics_id,
    })
  },
  onShareTimeline(res) {

  },
  onShareAppMessage: function (ops) {

  },
  onPageScroll(scroll) {
    if (scroll.scrollTop < 100) {
      this.setData({
        'nvabarData.bgColor': '',
        "nvabarData.fontColor": "#ffffff",
        "nvabarData.title": '',
        "nvabarData.logo": '',
      })
    }
    if (scroll.scrollTop > 100 && scroll.scrollTop < 110 && scroll.scrollTop < 110) {
      this.setData({
        'nvabarData.bgColor': 'rgba(255,255,255,0.1)',
        "nvabarData.fontColor": "#000000",
        "nvabarData.title": this.data.relicsInfo.info.name,
        "nvabarData.logo": this.data.relicsInfo.info.muse_info.logo,
      })
    } else if (scroll.scrollTop > 110 && scroll.scrollTop < 120) {
      this.setData({
        'nvabarData.bgColor': 'rgba(255,255,255,0.2)',
        "nvabarData.fontColor": "#000000",
        "nvabarData.title": this.data.relicsInfo.info.name,
        "nvabarData.logo": this.data.relicsInfo.info.muse_info.logo,
      })
    } else if (scroll.scrollTop > 120 && scroll.scrollTop < 130) {
      this.setData({
        'nvabarData.bgColor': 'rgba(255,255,255,0.4)',
        "nvabarData.fontColor": "#000000",
        "nvabarData.title": this.data.relicsInfo.info.name,
        "nvabarData.logo": this.data.relicsInfo.info.muse_info.logo,
      })
    } else if (scroll.scrollTop > 130 && scroll.scrollTop < 140) {
      this.setData({
        'nvabarData.bgColor': 'rgba(255,255,255,0.6)',
        "nvabarData.fontColor": "#000000",
        "nvabarData.title": this.data.relicsInfo.info.name,
        "nvabarData.logo": this.data.relicsInfo.info.muse_info.logo,
      })
    } else if (scroll.scrollTop > 140) {
      this.setData({
        'nvabarData.bgColor': 'rgba(255,255,255,1)',
        "nvabarData.fontColor": "#000000",
        "nvabarData.title": this.data.relicsInfo.info.name,
        "nvabarData.logo": this.data.relicsInfo.info.muse_info.logo,
      })
    }

  },
})