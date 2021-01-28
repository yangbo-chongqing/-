const app = getApp();
var http = require('../../utils/httputils.js');
Page({
  data: {
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '新增词条', //导航栏 中间的标题
      bgColor: '#ffffff',
      fontColor: '#00000'
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height,
    formats: {},
    bottom: 0,
    readOnly: false,
    placeholder: '写内容...',
    _focus: false,
    keyboardHeight: 0,
    relics_id: 0,
    entryTitle: '',
    entryImage: '',
    entryAudio: '',
    entryVideo: '',
    playFlag: true,
    entryContent: '',
    show: false,
    keyword: '',
    list: [],
    result: [],
    entrySelectData: []
  },
  //发布
  postPublish(){
    if(this.data.entryTitle==''){
      wx.showToast({
        icon:'none',
        title: '请填写词条名称'
      })
      return false;
    }
    if(this.data.entryImage == '' && this.data.entryVideo == ''){
      wx.showToast({
        icon:'none',
        title: '至少上传一个视频或图片'
      })
      return false;
    }
    let relids = [];
    if(this.data.entrySelectData.length>0){
      this.data.entrySelectData.map((item,index)=>{
        relids.push(item.id)
      })
    }
    let parmas = {
      name:this.data.entryTitle,
      image:this.data.entryImage,
      voice_url:this.data.entryAudio,
      video_url:this.data.entryVideo,
      content:this.data.entryContent,
      related_ids:relids.toString()
    }
    let url = '';
    if(this.data.relics_id!=''){
      url="/api/Data/Editor";
      parmas.id = this.data.relics_id
    }else{
      url="/api/Data/Publish"
    }
    http.postRequest(url, parmas,
    (res) => {
      wx.showToast({
        icon:'none',
        title: res.message,
      })
      wx.navigateBack()
    },
    function (err) {

    })

  },
  //查询相关词条
  getHomeData() {
    var prams = {
      keyword: this.data.keyword,
      type: 1
    }
    http.postRequest("/api/Data/EntryList", prams,
      (res) => {
        this.setData({
          list: res.data.list
        })
      },
      function (err) {

      })
  },
  //搜索赋值
  onChangeKeyWord(e) {
    this.setData({
      keyword: e.detail,
    });
  },
  //词条选择
  onChange(event) {
    this.setData({
      result: event.detail
    });
  },
  //删除词条
  delEntryData(e){
    let index = e.currentTarget.dataset.index;
    let arr = this.data.entrySelectData;
    arr.splice(index,1);
    this.setData({
      entrySelectData:arr
    })
  },
  //确认添加词条
  entryPopupOk() {
    let arr = [];
    if (this.data.list.length > 0) {
      this.data.list.map((item, index) => {
        this.data.result.map((citem, cindex) => {
          if (citem == item.id) {
            arr.push({ id: citem, name: item.name })
          }
        })
      })
    }
    this.setData({
      entrySelectData: arr,
      show: false
    })
  },
  noop() { },
  toggle(event) {
    const { index } = event.currentTarget.dataset;
    const checkbox = this.selectComponent(`.checkboxes-${index}`);
    checkbox.toggle();
  },
  //显示搜索相关词条
  showPopup() {
    this.setData({ show: true });
  },
  //关闭搜索相关词条
  onClose() {
    this.setData({ show: false });
  },
  //删除视频
  deleteVideo() {
    this.setData({
      entryVideo: ''
    })
  },
  //删除图片
  deleteImage() {
    this.setData({
      entryImage: ''
    })
  },
  //删除音乐
  deleteAudio() {
    this.setData({
      entryAudio: ''
    })
  },
  playAudio(e) {
    if (this.data.playFlag) { //初始化给backgroundAudioManager.src赋值
      this.data.myaudio.src = this.data.entryAudio;
      this.data.myaudio.title = '音频播放';
    } else {
      this.data.myaudio.pause();
    }
    this.setData({
      playFlag: !this.data.playFlag
    })
  },
  //赋值富文本
  entryContent(e){
    this.setData({
      entryContent:e.detail.html
    })
    console.log(this.data.entryContent);
  },
  //赋值标题
  titleInput(e){
    this.setData({
      entryTitle:e.detail.value
    })
  },
  //上传资源
  uploadFile(e) {
    let uploadType = e.currentTarget.dataset.type;
    let that = this;
    wx.showLoading({
      title: '资源上传中...',
    })
    wx.chooseImage({
      count: 1,
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
            success(res){
              wx.hideLoading()
              let data = JSON.parse(res.data)
              let resData =data.data.file_path;
              if(uploadType == 'video'){
                that.setData({
                  entryVideo:resData
                })
              }
              if(uploadType == 'image'){
                that.setData({
                  entryImage:resData
                })
              }
              if(uploadType == 'video'){
                that.setData({
                  entryAudio:resData
                })
              }
            }
          })
        }

      }
    })



  },
  readOnlyChange() {
    this.setData({
      readOnly: !this.data.readOnly
    })
  },
  onLoad(opt) {
    if (opt.id) {
      this.setData({
        relics_id: opt.id
      })
      this.getrelicsInfo();
    }
    const platform = wx.getSystemInfoSync().platform
    const isIOS = platform === 'ios'
    this.setData({ isIOS })
    const that = this
    this.updatePosition(0)
    let keyboardHeight = 0
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
    wx.onKeyboardHeightChange(res => {
      if (res.height === keyboardHeight) return
      const duration = res.height > 0 ? res.duration * 1000 : 0
      keyboardHeight = res.height
      setTimeout(() => {
        wx.pageScrollTo({
          scrollTop: 0,
          success() {
            that.updatePosition(keyboardHeight)
            that.editorCtx.scrollIntoView()
          }
        })
      }, duration)

    })
  },
  getrelicsInfo() {
    let that = this;
    var prams = {
      relics_id: this.data.relics_id
    }
    http.postRequest("/api/Home/RelicsInfo", prams,
      (res) => {
        // entryTitle:'',
        // entryImage:'',
        // entryAudio:'',
        // entryVideo:'',
        // entryContent:''
        if (res.data.info.content) {
        }
        this.setData({
          entryTitle: res.data.info.name,
          entryImage: res.data.info.image,
          entryAudio: res.data.info.voice_url,
          entryVideo: res.data.info.video_url,
          entryContent: res.data.info.content
        })
        if(res.data.info.related_list){
          let arr = [];
          res.data.info.related_list.map((item,index)=>{
            arr.push({id:item.id,name:item.name});
          })
          this.setData({
            entrySelectData:arr
          })
        }
        const that = this;
        this.setData({
          'nvabarData.title':res.data.info.name
        })
        wx.createSelectorQuery().select('#editor').context(function (res) {
          that.editorCtx = res.context;
          that.editorCtx.setContents({
            html: that.data.entryContent
          })
        }).exec();

      },
      function (err) {

      })
  },
  updatePosition(keyboardHeight) {
    const toolbarHeight = 50
    const { windowHeight, platform } = wx.getSystemInfoSync()
    let editorHeight = keyboardHeight > 0 ? (windowHeight - keyboardHeight - toolbarHeight) : windowHeight
    this.setData({ editorHeight, keyboardHeight })
  },
  // 编辑器初始化完成时触发
  onEditorReady() {
    const that = this;
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context;
      // that.editorCtx.setContents({
      //   html:that.data.entryContent
      // })
    }).exec();

  },
  undo() {
    this.editorCtx.undo();
  },
  redo() {
    this.editorCtx.redo();
  },
  format(e) {
    let {
      name,
      value
    } = e.target.dataset;
    if (!name) return;
    // console.log('format', name, value)
    this.editorCtx.format(name, value);
  },
  // 通过 Context 方法改变编辑器内样式时触发，返回选区已设置的样式
  onStatusChange(e) {
    const formats = e.detail;
    this.setData({
      formats
    });
  },
  // 插入分割线
  insertDivider() {
    this.editorCtx.insertDivider({
      success: function () {
        console.log('insert divider success')
      }
    });
  },
  // 清除
  clear() {
    this.editorCtx.clear({
      success: function (res) {
        console.log("clear success")
      }
    });
  },
  // 移除样式
  removeFormat() {
    this.editorCtx.removeFormat();
  },
  // 插入当前日期
  insertDate() {
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    this.editorCtx.insertText({
      text: formatDate
    });
  },
  // 插入图片
  insertImage() {
    let that = this;
    wx.chooseImage({
      count: 1,
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
            success(res){
              let data = JSON.parse(res.data)
              let resData =data.data.file_path;
              that.editorCtx.insertImage({
                src: resData,
                data: {
                  id: 'abcd',
                  role: 'god'
                },
                width: '100%',
                success: function () {
                }
              })
            }
          })
        }

      }
    })
  },
  
  //查看详细页面
  toDeatil() {
    this.editorCtx.getContents({
      success: (res) => {
        console.log(res.html)
        app.globalData.html = res.html
        wx.navigateTo({
          url: '../details/details'
        })

      },
      fail: (res) => {
        console.log("fail：", res);
      }
    });
  },
  onHide() {
    if (this.data.myaudio) {
      this.data.myaudio.stop();
    }
  }
})