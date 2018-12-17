// pages/doctor/doctor.js
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
  onLoad: function(options) {
    let that = this
    that.setData({
      hospital_id:options.hospital_id
    })
    that.getDoctors(59866,that.data.hospital_id);
  },
  getDoctors: function(tableId,id) {
    let that = this
    return new Promise(
      (resolve, reject) => {
        let query = new wx.BaaS.Query()
        query.contains('hospital_id', id)
        myfirst.getQueryTable(tableId, query).then(
          (res) => {
            console.log(res)
            that.setData({
              doctors:res.data.objects,
            })
            resolve()
          },
          (err) => {
            reject()
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
    wx.switchTab({
      url: '../indexo/indexo',
    })
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

  }
})