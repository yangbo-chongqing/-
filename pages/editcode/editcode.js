// pages/editcode/editcode.js
const app = getApp()
var http = require('../../utils/httputils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '寻声朗读', //导航栏 中间的标题
      bgColor: '#ffffff',
      fontColor: '#00000'
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height,
    codeData: '',
    message: '',
    id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    this.getMiniCode();
  },
  setMessage(e) {
    console.log(e);
    this.setData({
      message: e.detail.value
    })
  },
  //计算canvas位置吧px换算为rpx
  rpxSize(num) {
    let scale = wx.getSystemInfoSync().windowWidth / 375;
    return num * scale
  },
  canvasImgFun() {
    wx.showLoading({
      title: '图片生成中...',
    })
    let _this = this
    const ctx = wx.createCanvasContext('myCanvas')
    ctx.rect(0, 0, 350, 568)
    ctx.setFillStyle('#fff')
    ctx.fill()
    ctx.clip();//剪切
    wx.downloadFile({
      url: _this.data.codeData.code_url,
      success(res) {
        if (res.statusCode === 200) {
          ctx.drawImage(res.tempFilePath, _this.rpxSize(35), _this.rpxSize(20), _this.rpxSize(210), _this.rpxSize(210), 0, 0)
          ctx.draw()
          ctx.beginPath()
          ctx.drawImage('../../images/icons/code1.png', _this.rpxSize(5), _this.rpxSize(5), _this.rpxSize(25), _this.rpxSize(25), 0, 0)
          ctx.draw(true);
          ctx.beginPath()
          ctx.drawImage('../../images/icons/code2.png', _this.rpxSize(250), _this.rpxSize(345), _this.rpxSize(25), _this.rpxSize(25), 0, 0)
          ctx.draw(true);
          ctx.beginPath()
          ctx.font = 'normal bold 50px Monospaced Number,Chinese Quote,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Helvetica Neue,Helvetica,Arial,sans-serif'
          ctx.setFillStyle('#333333')
          ctx.setFontSize(_this.rpxSize(20))
          _this.drawText(ctx,_this.data.message,_this.rpxSize(40), _this.rpxSize(260) , _this.rpxSize(200),_this.rpxSize(210)) // 自动换行
          ctx.draw(true);
          ctx.save()
          _this.savecanvas();
        }
      }
    })
  },
  drawText(ctx, str, leftWidth, initHeight, titleHeight, canvasWidth) {
    var lineWidth = 0;
    var lastSubStrIndex = 0; //每次开始截取的字符串的索引
    for (let i = 0; i < str.length; i++) {
      lineWidth += ctx.measureText(str[i]).width;
      if (lineWidth > canvasWidth) {
        ctx.fillText(str.substring(lastSubStrIndex, i), leftWidth, initHeight); //绘制截取部分
        initHeight += 19; //16为字体的高度
        lineWidth = 0;
        lastSubStrIndex = i;
        titleHeight += 30;
      }
      if (i == str.length - 1) { //绘制剩余部分
        ctx.fillText(str.substring(lastSubStrIndex, i + 1), leftWidth, initHeight);
      }
    }
    // 标题border-bottom 线距顶部距离
    titleHeight = titleHeight + 10;
    return titleHeight
  },
  savecanvas() {
    let _this = this
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 350,
      height: 568,
      canvasId: 'myCanvas',
      success: function (res) {
        let img = res.tempFilePath
        wx.saveImageToPhotosAlbum({
          filePath: img,
          success(json) {
            wx.hideLoading();
            wx.showToast({
              title: '成功保存',
              icon: 'none',
              duration: 2000
            });
          },
          fail() {
            wx.hideLoading();
            wx.showToast({
              title: '保存失败',
              icon: 'none',
              duration: 2000
            });
          }
        })
      }
    })
  },
  // /api/Data/MiniCode
  getMiniCode() {
    var prams = {
      id: this.data.id,
    }
    http.postRequest("/api/Data/MiniCode", prams,
      (res) => {
        this.setData({
          codeData: res.data,
          message:res.data.name,
          'nvabarData.title': res.data.name
        })
      },
      function (err) {

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