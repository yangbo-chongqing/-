// components/prolist/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    listObj:{
      type:Object,
      value:{}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    openUrl(e){
      let id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/pages/apprecinfo/apprecinfo?id='+id,
      })
    }
  }
})
