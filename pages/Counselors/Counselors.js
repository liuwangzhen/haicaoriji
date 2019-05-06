// pages/Counselors/Counselors.js
const myFirst = require('../../utils/myfirst');
const myfirst = new myFirst()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height4: getApp().globalData.height,
    getshare: 0,
    curId: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    // 判断是不是推荐来的
    if(options.recommend!=undefined){
      that.setData({
        recommend:options.recommend
      })
    }
    if (options.getshare != undefined) {
      that.setData({
        getshare: 1,
        recommend: options.recommend,
      })
    } else {
      if (options.recommend != undefined) {
        that.setData({
          recommend: options.recommend
        })
      }
    }
    that.getToken()
    that.getCounselor()
  },
  intervalChange: function(e) {
    let index=e.detail.current
    let that=this
    that.setData({
      curId:index
    })
  },
  // 跳转咨询选项页面
  goCounselor: function(e) {
    let that = this
    let name = e.currentTarget.dataset.name
    let recommend = that.data.recommend
    if (recommend != undefined) {
      wx.navigateTo({
        url: '../chose/chose?name=' + name + '&recommend=' + recommend,
      })
    } else {
      wx.navigateTo({
        url: '../chose/chose?name=' + name,
      })
    }
  },
  // 得到咨询师信息
  getCounselor: function() {
    let that = this
    return new Promise(
      (resolve, rejecct) => {
        myfirst.getTable(60959, 30, 0, 'order').then(
          res => {
            that.setData({
              counselors: res.data.objects
            })
            resolve(res)
          }
        )
      }
    )

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
            if (res.data.is_authorized == false) {
              // if (res.data.jundge == false) {
              wx.redirectTo({
                url: '../../pages/login/login?recomId=' + that.data.recommend,
              })
            }
            resolve(res)
          }
        )
      }
    )
  },
  goback: function() {
    wx.navigateBack({
      delta: 1,
    })
  },
  goIndex: function() {
    let that = this
    let recommend = that.data.recommend
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    let that = this
    let recommend = that.data.recomId
    let id = that.data.id
    return {
      title: '海草日记',
      desc: '最具人气的小程序开发联盟!',
      path: '/pages/Counselors/Counselors?recommend=' + recommend + '&getshare=' + 1,
    }
  }
})