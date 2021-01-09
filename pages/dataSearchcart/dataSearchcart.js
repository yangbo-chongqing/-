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
      title: '店铺搜索', //导航栏 中间的标题
      bgColor:'#ffffff',
      fontColor:'#00000'
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height,
    type_id:'',
    muse_id:'',
    keyword:'',
    value: '',
    datalist:[],
    page:1,
    page_size:10,
    pageFlag:true
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
    //搜索还原数据转态
    this.setData({
      pageFlag:true,
      page:1,
      datalist:[]
    })
    this.getDataList();
  },
  getDataList() {
    if(this.data.pageFlag){
      var prams = {
        page_size:this.data.page_size,
        page:this.data.page,
        keyword:this.data.keyword
      }
      http.postRequest("/api/Home/GetMuse", prams,
        (res)=> {
          let arr = this.data.datalist.concat(res.data.muse_list);
          this.setData({
            datalist:arr
          })
          if(res.data.muse_list.length<this.data.page_size){
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
  //查询数据
  scrollgetdata(){
    this.getDataList();
  },
  //跳转店铺
  openUrl(e){
    let id = e.currentTarget.dataset.id;
    app.globalData.muse_id = id;
    wx.navigateTo({
      url: '/pages/appreciation/appreciation'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.type=='more'){
      this.getDataList();
    }
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
  
    
})