// header.js
const myFirst = require('../../utils/myfirst');
const myfirst = new myFirst()
Component({
  options: {
    multipleSlots: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: '海草日记',
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    canGoBack: false,
    getshare:0,
    height4:getApp().globalData.height
  },
  lifetimes: {
    attached() {
      // 在组件实例进入页面节点树时执行
      let that=this
      console.log('9990')
      that.getToken()
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
    ready() {
      console.log('990')
      wx.getSystemInfo({
        success: (res) => {
          this.setData({
            height4: res.statusBarHeight
          })
        }
      })
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    goback: function() {
      wx.navigateBack({
        delta: 1,
      })
    },
    getToken() {
      let that = this
      return new Promise(
        (resolve, reject) => {
          myfirst.getUserInfoByToken().then(
            res => {
              that.setData({
                recomId: res.data.id
              })
              
              resolve(res)
            }
          )
        }
      )
    },
    goIndex: function () {
      let that = this
      let recommend = that.data.recomId
      console.log(recommend)
      if (recommend != undefined) {
        wx.reLaunch({
          url: '../indexo/indexo?recommend=' + recommend,
        })
      } else {
        wx.switchTab({
          url: '../indexo/indexo',
        })
      }
    },
  }
})