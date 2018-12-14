// pages/hosdetail/hosdetail.js
const myFirst = require('../../utils/myfirst');
const myfirst = new myFirst()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height4: getApp().globalData.height,
    hospital:"",
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   let that=this
   let id=options.id
   that.setData({
     id:options.id
   })
    that.getHospital(59863,id)
    that.getDoctors()
  },
  getHospital:function(a,b){
    return new Promise(
      (resolve,reject)=>{
        let that = this
        myfirst.getRecord(a, b).then(
          res => {
            that.setData({
              hospital: res.data,
              score:Math.round(res.data.score)
            })
            resolve(res)
          },
          err=>{
            reject(err)
          }
        )
      }
    )
  },
  getDoctors:function(){
    let that=this
    let tableId=59866
    let id=that.data.id
    let a='hospital_id'
    let query = new wx.BaaS.Query()
    query.contains(a,id)
    myfirst.getQueryTable(tableId,query).then(
      res=>{
        that.setData({
          doctors:res.data.objects
        })
      }
    )
  },
  goback: function () {
    wx.navigateBack({
      delta: 1,
    })
  },
  goIndex: function () {
    wx.switchTab({
      url: '../indexo/indexo',
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
  
  }
})