// pages/updata/updata.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: "",
    img: "",
    array: ['男', '女'],
    sign: "",
    height4: getApp().globalData.height,
    // date: "1995-04-18",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that=this
    this.getUserInfo();
    var nowdate = new Date();
    that.setData({
      nowdate: nowdate,
    })
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
  bindPickerChange: function(e) {
    let that = this
    this.setData({
      index: e.detail.value
    })
    let MyUser = new wx.BaaS.User()
    let currentUser = MyUser.getCurrentUserWithoutData()
    let index = parseInt(that.data.index)+1
    
    currentUser.set('sex', index).update().then(res => {
      // success

    }, err => {
      // err
    })
  },
  bindDateChange: function(e) {
    let that = this
    that.setData({
      date: e.detail.value
    })
    let MyUser = new wx.BaaS.User()
    let currentUser = MyUser.getCurrentUserWithoutData()
    let date = that.data.date
    currentUser.set('birthday', date).update().then(res => {
      // success
    }, err => {
      // err
    })
  },
  upsign: function() {
    wx.navigateTo({
      url: '../upsign/upsign',
    })
  },
  getUserInfo: function() {
    let that = this
    let MyUser = new wx.BaaS.User()
    wx.BaaS.login(false).then(res => {
      MyUser.get(res.id).then(res => {
        var datetime = new Date(res.data.birthday);
        var year = datetime.getFullYear();
        var month = datetime.getMonth() + 1;
        if (month <= 9) {
          month = "0" + month;
        }
        var date = datetime.getDate();
        if (date <= 9) {
          date = "0" + date;
        }
        var dateformat = year + "-" + month + "-" + date;
        res.data.sign=that.LimitNumbersadf(res.data.sign);
        that.setData({
          userInfo: res.data,
          img: res.data.headimg.replace(/\"/g, ""),
          index: (res.data.sex)-1,
          date: dateformat,
          sign: res.data.sign,
        })
      }, err => {
        // err
      })

    }, err => {
      // 登录失败
    })
  },
  LimitNumbersadf(txt) {

    var str = txt;
    str = str.substr(0, 12);
    str += '...'
    return str;
  },
  upImg: function() {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {

        let imgs = res.tempFilePaths[0]

        let MyFile = new wx.BaaS.File()
        let fileParams = {
          filePath: res.tempFilePaths[0]
        }
        let metaData = {
          categoryName: 'SDK'
        }
        MyFile.upload(fileParams, metaData).then(res => {

          let MyUser = new wx.BaaS.User()
          let currentUser = MyUser.getCurrentUserWithoutData()
          let img = res.data.path

          currentUser.set('headimg', img).update().then(res => {
            // success

            that.setData({
              img: res.data.headimg.replace(/\"/g, ""),
            })

          }, err => {
            // err
          })
        }, err => {

        })
      }
    })

  },
  upnick: function() {
    wx.navigateTo({
      url: "../upnick/upnick"
    })
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
    this.getUserInfo();
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '海草日记',
      desc: '最具人气的小程序开发联盟!',
      path: '/pages/indexo/indexo',
    }
  }
})