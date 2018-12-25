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
    getshare:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    if(options.getshare!=undefined){
      that.setData({
        getshare:options.getshare,
        recommend:options.recommend,
        id: options.id,
      })
    }
    else{
    if (options.recommend != undefined){
      that.setData({
        id: options.id,
        recommend: options.recommend
      })
    }
    else {
      that.setData({
        id: options.id,
      })
    }}
    that.getDoctor(options.id)
    that.getToken()
  },
  goHospital:function(){
    let that=this
    let recommend=that.data.recommend
    if (recommend != undefined) {
      wx.navigateTo({
        url: '../hosdetail/hosdetail?id=' + that.data.hos_id + '&recommend=' + recommend
      })
    }
    else {
      wx.navigateTo({
        url: '../hosdetail/hosdetail?id=' + that.data.hos_id,
      })
    }
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
  goback: function () {
    wx.navigateBack({
      delta: 1,
    })
  },
  goIndex: function () {
    let that=this
    let recommend = that.data.recommend
    console.log(recommend)
    if (recommend != undefined) {
      wx.reLaunch({
        url: '../indexo/indexo?recommend=' + recommend,
      })
    }
    else {
      wx.switchTab({
        url: '../indexo/indexo',
      })
    }
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
            let time=year-parseInt(res.data.startTime)
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
    let that = this
    let recommend = that.data.recomId
    let id = that.data.id
    return {
      title: '海草日记',
      desc: '最具人气的小程序开发联盟!',
      path: '/pages/doctorDetail/doctorDetail?recommend=' + recommend + '&id=' + id+'&getshare='+1,
    }
  }
})