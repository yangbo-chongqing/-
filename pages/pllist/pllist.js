// pages/pllist/pllist.js
var http = require('../../utils/httputils.js');
const app = getApp()
const recorderManager = wx.getRecorderManager()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      isHome: false, //是否显示home按钮
      isSearch:false,
      bgColor:'',
      fontColor:'#ffffff',
      title:''
    },
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
    page: 1,
    page_size: 10,
    is_getListFlag: true,
    timeNumber: '00:00',
    duration: 0,
    hfIndex:'',
    myaudio: '',
    playFlag: true,
    savevoice:''
  },
  playAudio(e) {
    let voice_url = e.currentTarget.dataset.voice;
    console.log(voice_url)
    console.log(this.data.savevoice)
    if (this.data.myaudio.paused || this.data.myaudio.paused == undefined || this.data.savevoice!=voice_url) { 
      this.setData({
        savevoice:voice_url
      })
      this.data.myaudio.src = voice_url;
      this.data.myaudio.title = '音频播放';
    } else {
      this.data.myaudio.pause();
    }
    this.setData({
      playFlag: !this.data.playFlag
    })
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
        duration: time,
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
      console.log(res);
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
          console.log(data.data);
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
      duration: this.data.duration
    }
    http.postRequest("/api/Home/RelicsComment", parmas,
      (res) => {
        wx.showToast({
          title: res.message,
        })
        let arr = this.data.commentList;
        res.data.info.duration = this.formate(res.data.info.duration);
        if(this.data.reply_id){
          arr[this.data.hfIndex].list.unshift(res.data.info);
        }else{
          arr.unshift(res.data.info)
        }
        this.setData({
          comment: '',
          reply_id: '',
          image: [],
          voice: '',
          hfIndex:'',
          commentList:arr,
          duration: 0,
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
  //评论列表
  RelicsCommentList() {
    if (this.data.is_getListFlag) {
      let parmas = {
        page: this.data.page,
        page_size: this.data.page_size,
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

          arr.map((item)=>{
            item.duration = this.formate(item.duration);
          })
          this.setData({
            commentList: arr
          })
          if (res.data.list.length < this.data.page_size) {
            this.setData({
              is_getListFlag: false
            })
          } else {
            this.data.page++
          }
        },
        function (err) {

        })
    }
  },
  CommentLike(e) {
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
        if(res.status == 200){
          let arr = this.data.commentList;
          if(itemindex>=0){
            arr[index].list[itemindex].likes++;
            arr[index].list[itemindex].is_like = 1;
          }
          else{
            arr[index].likes++;
            arr[index].is_like = 1;
          }
          this.setData({
            commentList:arr
          })
        }
      },
      function (err) {

      })
  },
  //上传图片
  uploadImg() {
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
              console.log(data.data);
              let imgs = that.data.image.concat(data.data.file_path);
              that.setData({
                image: imgs
              })
              if (that.data.image.length == tempFilePaths.length) {
                console.log(that.data.image);
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
    console.log(imgs);
    console.log(index);
    wx.previewImage({
      current: imgs[index], // 当前显示图片的http链接
      urls: imgs // 需要预览的图片http链接列表
    })
  },
  showPopup() {
    this.setData({
      plShow: true
    });
  },
  onClose() {
    this.setData({
      plShow: false,
      lyFlag: 0
    });
    that.RelicsSubmit();
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
      hfIndex:index
    })
  },
  blurInput() {
    this.setData({
      placeholder: '请输入评论'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      relics_id: options.id
    })
    this.RelicsCommentList();
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
    this.data.myaudio.stop();
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