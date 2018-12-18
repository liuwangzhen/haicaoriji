// pages/video/video.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    check: true,
    src: "",
    img:"",
    height4: getApp().globalData.height,
    isMakingPoster: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getUserInfoByToken();
  },
  getUserInfoByToken: function () {
    let that = this
    let MyUser = new wx.BaaS.User()
    wx.BaaS.login(false).then(res => {
      MyUser.get(res.id).then(res => {
        that.setData({
          author_head: res.data.headimg,
          author_name: res.data.nick,
        })
      })
    })
  },
  addimg:function(){
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        that.setData({
          img: res.tempFilePaths[0]
        })}
    })
  },
  add: function() {
    let that = this
    wx.chooseVideo({
      sourceType: ['album'],
      maxDuration: 60,
      camera: 'back',
      success: function(res) {
        that.setData({
          src: res.tempFilePath
        })}
    })
  },
      submit: function() {
        let tableID = 55960
        let Product = new wx.BaaS.TableObject(tableID)
        let product = Product.create()
        let that = this
        let MyFile = new wx.BaaS.File()
        let metaData = {
          categoryID: '5c04c308fac2e571d1eb802a'
        }
        let fileParams = {
          filePath: that.data.src
        }
        let fileParams2 = {
          filePath: that.data.img
        }
        setTimeout(function(){
          if (that.data.src == '' || that.data.content == ''||that.data.img==""){
            wx.showToast({
              title: '请输入完整',
              icon: 'none',
              duration: 2000
            })
          }
          else{
            wx.showModal({
              title: '提示',
              content: '确认发布',
              success: function (res) {
                if (res.confirm) {
                  that.setData({
                    isMakingPoster: true,
                  })
                  MyFile.upload(fileParams, metaData).then(res => {
                    console.log(res)
                    let src=res.data.path
                    MyFile.upload(fileParams2, metaData).then(res => {
                    console.log(res)
                    let img=res.data.path
                    let apple = {
                      img: [img],
                      content: that.data.content,
                      video:src,
                      author_head: that.data.author_head,
                      author_name: that.data.author_name,
                    }
                    product.set(apple).save().then(res => {
                      wx.showToast({
                        title: '提交成功..',
                        icon: 'success',
                        duration: 2000,
                        success: function (res) {
                          that.setData({
                            content: "",
                            src:"",
                            img:"",
                            isMakingPoster: false,
                          })
                          wx.switchTab({
                            url: '../../pages/indexo/indexo',
                          })
                        }})

                    },err=>{
                      that.setData({
                        isMakingPoster: false,
                      })
                      wx.showToast({
                        title: '发布失败',
                        icon:"none"
                      })
                    })
                  })
                  }, err => {
                    that.setData({
                      isMakingPoster: false,
                    })
                    wx.showToast({
                      title: '发布失败',
                      icon: "none"
                    })
                  })
              }
              }
              })
       
          }
        }, 200)
  },
  deleteVideo: function() {
    let that = this
    that.setData({
      src: ""
    })
  },
deleteimg:function(){
let that=this
that.setData({
  img:"",
})
  },
  focusChange: function () {
    let that = this
    that.setData({
      focus1: false,
      focus2: true,
      focus3: true,
    })
  },
  content: function (e) {
    var that = this;
    var value = e.detail.value;
    // let str = value.split('\n').join('&hc')
    // value = value.replace(/\ /g, "");
    this.setData({
      content: value,
      focus1: true,
      focus2: false,
      focus3: false,
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

  }
})