// pages/hospital/hospital.js
const myFirst = require('../../utils/myfirst');
const myfirst = new myFirst()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height4: getApp().globalData.height,
    list:[],
    page:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that=this
    that.getHospital()
  },
  
  getHospital: function() {
    let that = this
    return new Promise(
      (resolve,reject)=>{
        myfirst.getTable(59863,10,0,'created_at').then(
          (res)=>{
            that.setData({
              list:res.data.objects,
              page:0,
            })
            resolve()
          }
        )
      }
    )
  },
  getHospital2: function () {
    let that = this
    let page=that.data.page
    page++
    return new Promise(
      (resolve, reject) => {
        myfirst.getTable(59863, 10, page*10, 'created_at').then(
          (res) => {
            if(res.data.objects==""){
              wx.showToast({
                title: '亲，(╯-╰) 没有啦',
                icon: 'none',
              })
            }
            that.setData({
              list: that.data.list.concat(res.data.objects),
              page:page
            })
            resolve()
          }
        )
      }
    )
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
    let that = this
    wx.stopPullDownRefresh();
    setTimeout(
      function () {
        that.getHospital();
      }, 500
    )
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let that=this
    wx.stopPullDownRefresh();
    setTimeout(
      function(){
        that.getHospital2();
      },500
    )
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})