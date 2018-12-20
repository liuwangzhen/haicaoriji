// pages/doctorDetail/doctorDetail.js
const myFirst = require('../../utils/myfirst');
const myfirst = new myFirst()
const nowDate=new Date()
const year = parseInt(nowDate.getFullYear())
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height4: getApp().globalData.height,
    rotate:false,
    doctor:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     let that=this
     that.setData({
       id:options.id
     })
     that.getDoctor(options.id)
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
  goRotate:function(){
    let that=this;
    let rotate=that.data.rotate
    that.setData({
      rotate:!rotate
    })
  },
  
  getDoctor:function(id){
    let that=this
    return new Promise(
      (resolve,reject)=>{
        myfirst.getRecord(59866, id, 10, 0,'created_at').then(
          res=>{
            console.log(res.data.startTime)
            console.log(res.data.education)
            let time=year-res.data.startTime
            that.setData({
              doctor:res.data,
              hos_id: res.data.hospital_id,
              time:time
            })
            resolve(that.getHospital(59863, res.data.hospital_id, 10, 0, 'created_at'))
          },
          err=>{
            reject()
          }
        )
      }
    )
  },
  getHospital:function(a,b){
    return new Promise(
      (resolve, reject) => {
        let that = this
        myfirst.getRecord(a, b, 10, 0, 'created_at').then(
          res => {
            that.setData({
              hospital: res.data,
            })
            resolve(res)
          },
          err => {
            reject(err)
          }
        )
      }
    )
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