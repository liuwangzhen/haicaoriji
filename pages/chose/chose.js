// pages/chose/chose.js
const myFirst = require('../../utils/myfirst');
const myfirst = new myFirst()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    height4: getApp().globalData.height,
    cdata: [{
        id: 9,
        title: '玻尿酸'
      }, {
        id: 9,
        title: '肉毒素'
      }, {
        id: 9,
        title: '眼部整形'
      },
      {
        id: 9,
        title: '鼻部整形'
      }, {
        id: 9,
        title: '胸部整形'
      }, {
        id: 9,
        title: '医学美肤'
      },
      {
        id: 9,
        title: '面部轮廓'
      },
      {
        id: 9,
        title: '吸脂瘦身'
      },
    ],
    inputVal: "",
    list: [],
    isClick: true,
    isClick2: true,
    focus2: false,
    elastic: true,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    myfirst.getUserInfoByToken().then(
      res => {
        that.setData({
          phone: res.data.phone
        })
        console.log(that.data.phone)
      },
      err => {
        console.log(err)
      }
    )
  },
  goback: function() {
    wx.navigateBack({
      delta: 1,
    })
  },
  ischose: function(e) {
    let that = this
    let idx = e.currentTarget.dataset.index
    let a = e.currentTarget.dataset.name
    let list = that.data.list
    let isClick = that.data.isClick
    if (isClick == true) {
      that.setData({
        isClick: false
      })
      if (list.indexOf(a) > -1) {
        that.offchose(idx, a);
      } else {
        that.onchose(idx, a);
      }
      setTimeout(function() {
        that.setData({
          isClick: true
        })
      }, 100)
    }
  },
  onchose: function(idx, a) {
    let that = this
    let cdata = that.data.cdata
    cdata[idx].id = idx
    that.setData({
      list: that.data.list.concat(a),
      cdata: cdata,
    })
  },
  getFocus: function() {
    let that = this
    that.setData({
      focus2: true,
      elastic: false,
    })
  },
  bindfocus: function(e) {
    let that = this
    that.setData({
      height5: e.detail.height
    })
  },
  bindblur: function(e) {
    let that = this
    that.setData({
      elastic: true
    })
  },
  offchose: function(idx, a) {
    let that = this
    let cdata = that.data.cdata
    cdata[idx].id = 9
    let list = that.data.list
    let num = list.indexOf(a)
    list.splice(num, 1)
    that.setData({
      list: list,
      cdata: cdata,
    })
  },
  goIndex: function() {
    wx.switchTab({
      url: '../indexo/indexo',
    })
  },
  inputVal: function(e) {
    let that = this
    that.setData({
      inputVal: e.detail.value
    })
  },
  getPhoneNumber(e) {
    let that = this
    let a = e.currentTarget.dataset.id
    let encryptedData = e.detail.encryptedData
    let iv = e.detail.iv
    wx.checkSession({
      success: function(res) {
        console.log("处于登录态");
        wx.BaaS.wxDecryptData(encryptedData, iv, 'phone-number').then(decrytedData => {
          console.log(decrytedData)
          let a = {
            'phone': decrytedData.phoneNumber,
            label: that.data.list,
            realname: that.data.inputVal,
          }
          myfirst.renew(a).then(
            res => {
              console.log(res)
              wx.showToast({
                title: '提交成功',
                icon: "success",
                duration:200,
                success: function () {
                  wx.showModal({
                    title: '提示',
                    content: '感谢提交,我们的咨询人员将会与您联系',
                    showCancel: false,
                    success: function () {
                      wx.navigateBack({
                        delta: 1
                      })
                    },
                  })
                }
              })
            },
            err => {
              wx.showToast({
                title: '提交失败',
              })
            }
          )
        }, err => {
          // 失败的原因有可能是以下几种：用户未登录或 session_key 过期，微信解密插件未开启，提交的解密信息有误
        })
      },
      fail: function(res) {
        wx.showToast({
          title: '提交失败，请重试',
          icon: "none",
        })
        console.log("需要重新登录");
        wx.BaaS.logout()
        wx.BaaS.login()
      }
    })


  },
  upload: function() {
    let that = this
    let list = that.data.list
    let inputVal = that.data.inputVal
    let a = {
      label: list,
      realname: inputVal
    }
    wx.showModal({
      title: '提示',
      content: '是否确认提交',
      success: function(res) {
        if (res.confirm) {
          myfirst.renew(a).then(
            res => {
              wx.showToast({
                title: '提交成功',
                icon:"success",
                duration: 200,
                success:function(){
                  wx.showModal({
                    title: '提示',
                    content: '感谢提交,我们的咨询人员将会与您联系',
                    showCancel:false,
                    success:function(){
                      wx.navigateBack({
                        delta:1
                      })
                    },
                  })
                }
              })
            }, err => {
              console.log(err)
              wx.showToast({
                title: '提交失败',
                icon: "none",
              })
            }
          )
        } else if (res.cancel) {}
      }
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