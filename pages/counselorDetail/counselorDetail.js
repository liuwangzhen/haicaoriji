// pages/counselorDetail/counselorDetail.js
const myFirst = require('../../utils/myfirst');
const myfirst = new myFirst()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     let that=this
     that.setData({
       id:options.id
     })
     that.getCounselor()
    that.getToken()
    console.log(options.id)
  },
  getEwr:function(){
    let that=this
    wx.BaaS.getWXACode('wxacodeunlimit', params, true, '二维码').then(res => {
      wx.getImageInfo({
        src: res.download_url,
        success: function (res) {
          that.setData({
            ewrImg: res.path
          })
          //  that.btnchose();
        }
      })
    })
  },
  getToken(){
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
                url: '../../pages/login5/login5?recomId=' + that.data.recommend+"&id="+that.data.id,
              })
            }
            resolve(res)
          }
        )
      }
    )
  },
  getCounselor:function(){
    let that=this 
    return new Promise(
      (resolve,reject)=>{
        myfirst.getRecord(60959, that.data.id).then(
          res=>{
            console.log(res)
            let a = res.data.skills; // 字符串
            let b = a.split(" "); // 将字符串按照","分割，存入数组b.
            console.log(b)
            that.setData({
              counselor:res.data,
              skills:b
            })
          }
        )
      }
    )
  },
  goCounselor: function (e) {
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
    let title = '咨询师'+that.data.counselor.name
    let recommend = that.data.recomId
    return {
      title: title,
      desc: '最具人气的小程序开发联盟!',
      imageUrl:that.data.counselor.poster.path,
      path: '/pages/counselorDetail/counselorDetail?id=' + that.data.id + "&recommend=" + recommend,
    }
  }
})