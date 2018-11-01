// pages/shopCat/shopCat.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls:[]
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDetail();
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
  getDetail:function(){
    var that=this;
    let tableID = 54498
    let recordID = '5bcd3d1358c6530e414e6e47'

    let Product = new wx.BaaS.TableObject(tableID)

    Product.get(recordID).then(res => {
      // success
      that.setData({
        imgUrls:res.data.bookArr
      })
      console.log(res)
    }, err => {
      // err
    })
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