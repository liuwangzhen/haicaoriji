// pages/drugDetail/drugDetail.js
const myFirst = require('../../utils/myfirst');
const myfirst = new myFirst()
Page({

  /**
   * 页面的初始数据
   */
  data: {
   title:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    that.setData({
      title:options.key
    })
    that.getRecord()
  },
  getRecord:function(){
    let that=this
    let title=that.data.title
    let query = new wx.BaaS.Query()
    query.compare('projectName',"=", title)
    return new Promise(
      (resolve,reject)=>{
        myfirst.getTableSelect(64308, 1, 0, 'created_at', '-created_at', query).then(
          res=>{
            that.setData({
              drugDetail:res.data.objects[0]
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