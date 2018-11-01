// pages/upsign/upsign.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:"",
    sign:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfo();
  },
  sign:function(e){
    var that = this;

    var value = e.detail.value;


    // value = value.replace(/\ /g, "");
    this.setData({
      sign: value
    })
    console.log(that.data.sign)
  },
  getUserInfo: function () {
    let that = this
    let MyUser = new wx.BaaS.User()
    wx.BaaS.login(false).then(res => {
      MyUser.get(res.id).then(res => {
        // success

        that.setData({
          userInfo: res.data,
          sign:res.data.sign,

        })
      }, err => {
        // err
      })
      登录成功

    }, err => {
      // 登录失败
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  submit:function(){
    let that = this;
    let MyUser = new wx.BaaS.User()
    let currentUser = MyUser.getCurrentUserWithoutData()
    console.log(that.data.sign)
    let sign = that.data.sign
    currentUser.set('sign', sign).update().then(res => {
      // success
      console.log(res)

      wx.navigateBack({
        delta: 1,
      })

    }, err => {
      // err
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getUserInfo();
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