// pages/projectDetail/projectDetail.js
const myFirst = require('../../utils/myfirst');
const myfirst = new myFirst()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:"",
    idx:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    that.setData({
       title:options.title,
       idx:options.idx,
    })
    that.getProjectDetail(options.key)
  },
  getProjectDetail: function (key) {
    let that = this
    let query = new wx.BaaS.Query()
    query.compare('keywords', '=', key)
    return new Promise(
      (resolve, reject) => {
        myfirst.getTableSelect(63308, 1, 0, 'create_at', '-created_at', query).then(
          res => {
            console.log(res.data.objects)
            that.setData({
              projectDetail: res.data.objects[0]
            })
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