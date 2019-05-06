// pages/CounselorOne/CounselorOne.js
const myFirst = require('../../utils/myfirst');
const myfirst = new myFirst()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height4: getApp().globalData.height,
    getshare: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    let a=new Promise(
      (resolve,reject)=>{
        if (options.getshare != undefined) {
          that.setData({
            getshare: 1,
            recommend: options.recommend,
            id: options.id,
          })
        }
        else {
          if (options.recommend != undefined) {
            that.setData({
              id: options.id,
              recommend: options.recommend
            })
          }
          else {
            that.setData({
              id: options.id,
            })
          }
        }
        resolve()
      }
    )
    a.then(
      res => {
        that.getCounselor()
        that.getToken()
        }
    )
  },
  // 得到咨询师信息
  getCounselor:function(){
    let that=this
    let id=that.data.id
    myfirst.getRecord(60959, id).then(
      res=>{
        that.setData({
          counselor:res.data
        })
      }
    )
  },
  // 获取个人信息
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
    let that = this
    let recommend = that.data.recommend
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
      path: '/pages/CounselorOne/CounselorOne?recommend=' + recommend + '&id=' + id + '&getshare=' + 1,
    }
  }
})