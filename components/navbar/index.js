const app = getApp()
Component({
  properties: {
    navbarData: {   //navbarData   由父页面传递的数据，变量名字自命名
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {}
    }
  },
  data: {
    height: '',
    //默认值  默认显示左上角
    navbarData: {
      showCapsule: 1
    },
    isHome:false
  },
  attached: function () {
    // 获取是否是通过分享进入的小程序
    this.setData({
      share: app.globalData.share
    })
    // 定义导航栏的高度   方便对齐
    this.setData({
      height: app.globalData.height
    })
    let pages = getCurrentPages(); //获取当前页面信息栈
    let prevPage = pages[pages.length - 2] //获取上一个页面信息栈
    if(!prevPage){
      this.setData({
        isHome:true
      })
    }else{
      this.setData({
        isHome:false
      })
    }
  },
  methods: {
  // 返回上一页面
    _navback() {
      wx.navigateBack()
    },
  //返回到首页
    _backhome() {
      if(this.properties.navbarData.isHome){
        wx.switchTab({
          url: '/pages/index/index',
        })
      }else{
        wx.reLaunch({
          url: '/pages/appreciation/appreciation',
        })
      }
      
    },
    //搜索
    _dataSearch() {
      wx.navigateTo({
        url: '/pages/dataSearch/dataSearch',
      })
    },
    //店铺搜索
    _dataSearchcart(){
      wx.navigateTo({
        url: '/pages/dataSearchcart/dataSearchcart',
      })
    }
  }

}) 