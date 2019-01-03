// pages/counselor/counselor.js
const myFirst = require('../../utils/myfirst');
const myfirst = new myFirst()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height4: getApp().globalData.height,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    that.getToken()
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
  goConsolt:function(){
   let that=this
   wx.navigateTo({
     url: '../chose/chose',
   })
  },
  goCounselors:function(){
   let that=this
   wx.navigateTo({
     url: '../Counselors/Counselors',
   })
  },
  goActives:function(){
     let that=this
     wx.navigateTo({
       url: '../activities/activities',
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
    let that = this
    let recommend = that.data.recomId
    return {
      title: '海草日记',
      desc: '最具人气的小程序开发联盟!',
      path: '/pages/indexo/indexo?recommend=' + recommend,
    }
  }
})