// components/title/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    titleObj: {
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {}
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
    openJump(){
      wx.navigateTo({
        url: '/pages/dataList/dataList?type_id='+this.properties.titleObj.id,
      })
    },
    clickhyh(){
      this.triggerEvent('eventclick')
    }
  }
})
