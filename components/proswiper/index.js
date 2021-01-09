// components/proswiper/index.js
//获取应用实例
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    swiperObj:{
      type:Object,
      value:{}
    },
    type:{
      type:String,
      value:'s0'
    }
  },
  ready(){
    if(this.properties.swiperObj.length>3){
      this.setData({
        multipleItem:3.5
      })
    }else{
      this.setData({
        multipleItem:this.properties.swiperObj.length
      })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    multipleItem:1
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //切换数据
  openToggleData(e) {
    let id = e.currentTarget.dataset.id;
    this.data.videoContext = wx.createVideoContext('myVideo');
    this.data.videoContext.pause();
    wx.navigateTo({
      url: '/pages/apprecinfo/apprecinfo?id=' + id
    })
  },
    openUrl(e){
      let id = e.currentTarget.dataset.id;
      app.globalData.muse_id = id;
      wx.navigateTo({
        url: '/pages/appreciation/appreciation'
      })
    }
  }
})
