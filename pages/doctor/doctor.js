// pages/doctor/doctor.js
const myFirst = require('../../utils/myfirst');
const myfirst = new myFirst()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height4: getApp().globalData.height,
    page:0,
    doctors:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    that.setData({
      hospital_id:options.hospital_id
    })
    that.getDoctors(59866, that.data.hospital_id, 10, 0,'created_at');
  },
  getDoctors: function(tableId,id,a,b,c){
    let that = this
    return new Promise(
      (resolve, reject) => {
        let query = new wx.BaaS.Query()
        query.contains('hospital_id', id)
        myfirst.getQueryTable(tableId,query,a,b,c).then(
          (res) => {
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
  getDoctors2: function (tableId, id, a, b, c) {
    let that = this
    return new Promise(
      (resolve, reject) => {
        let query = new wx.BaaS.Query()
        query.contains('hospital_id', id)
        myfirst.getQueryTable(tableId, query, a, b, c).then(
          (res) => {
            if(res.data.objects==""){
              wx.showToast({
                title: '亲，(╯-╰) 没有啦',
                icon: 'none',
              })
            }
            that.setData({
              doctors:that.data.doctors.concat(res.data.objects),
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
    let that=this
    wx.stopPullDownRefresh();
    setTimeout(
      function(){
        that.getDoctors(59866, that.data.hospital_id, 10, 0, 'created_at');
        that.setData({
          page: 0
        })
      },500
    )
   
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let that=this
    let page=that.data.page
    page++
    wx.stopPullDownRefresh();
    setTimeout(function(){
      that.getDoctors2(59866, that.data.hospital_id, 10, page * 10, 'created_at');
      console.log(page)
      that.setData({
        page: page
      })
    },500)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})