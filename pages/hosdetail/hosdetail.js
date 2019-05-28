// pages/hosdetail/hosdetail.js
const myFirst = require('../../utils/myfirst');
const myfirst = new myFirst()
const nowDate = new Date()
const year = parseInt(nowDate.getFullYear())
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height4: getApp().globalData.height,
    hospital: "",
    rotate: false,
    getshare: 0,
    page: 0,
    doctors: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let id = options.id
    if (options.getshare != undefined) {
      that.setData({
        getshare: 1,
        recommend: options.recommend,
        id: options.id,
      })
    } else {
      if (options.recommend != undefined) {
        console.log(options.recommend)
        that.setData({
          id: options.id,
          recommend: options.recommend
        })
      } else {
        that.setData({
          id: options.id,
        })
      }
    }
    that.getHospital(59863, options.id)
    that.getDoctors(options.id, 0)
    that.getToken()

  },
  actPreview: function (e) {
    let that = this
    let current = e.currentTarget.dataset.path
    let activity = that.data.hospital.activity
    let arr1 = activity.map(
      (item) => {
        return item.path
      }
    )
    console.log(arr1)
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: arr1 // 需要预览的图片http链接列表
    })

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
  goDoctor: function (e) {
    let that = this
    let id = e.currentTarget.dataset.id
    let recommend = that.data.recommend
    if (recommend != undefined) {
      wx.navigateTo({
        url: "../doctorDetail/doctorDetail?id=" + id + '&recommend=' + recommend
      })
    } else {
      wx.navigateTo({
        url: "../doctorDetail/doctorDetail?id=" + id
      })
    }
  },
  goRotate: function () {
    let that = this;
    let rotate = that.data.rotate
    that.setData({
      rotate: !rotate
    })
  },
  getQualification: function () {
    let that = this
    let list = that.data.hospital.qualification
    let list2 = new Array
    for (let i = 0; i < list.length; i++) {
      list[i] = list[i].path
      list2.push(list[i])
    }
    that.setData({
      list2: list2
    })
  },
  getPoster: function () {
    let that = this
    let list = that.data.hospital.poster
    let list2 = new Array
    for (let i = 0; i < list.length; i++) {
      list[i] = list[i].path
      list2.push(list[i])
    }
    that.setData({
      list: list2
    })
  },
  getHospital: function (a, b) {
    return new Promise(
      (resolve, reject) => {
        let that = this
        myfirst.getRecord(a, b, 1, 0, 'created_at').then(
          res => {
            that.setData({
              hospital: res.data,
              score: Math.round(res.data.score)
            })
            resolve(that.getQualification(), that.getPoster())
          },
          err => {
            reject(err)
          }
        )
      }
    )
  },
  goDoctors: function () {
    let that = this
    let recommend = that.data.recommend
    console.log(recommend)
    if (recommend != undefined) {
      wx.navigateTo({
        url: '../doctor/doctor?hospital_id=' + that.data.id + '&recommend=' + recommend
      })
      console.log(that.data.id)

    } else {
      wx.navigateTo({
        url: '../doctor/doctor?hospital_id=' + that.data.id,
      })
    }
  },
  getDoctors: function (id, page) {
    let that = this
    let tableId = 59866
    let a = 'hospital_id'
    let query = new wx.BaaS.Query()
    query.contains(a, id)
    myfirst.getQueryTable(tableId, query, 10, page * 10, '-order').then(
      res => {
        let list = new Array
        let list0 = res.data.objects
        for (let i = 0; i < list0.length; i++) {
          list0[i].time = year - parseInt(list0[i].startTime)
          list.push(list0[i])
        }
        that.setData({
          doctors: that.data.doctors.concat(list),
        })
      }
    )
  },
  previewImage: function (e) {
    let that = this
    let current = e.currentTarget.dataset.path
    let arr1 = that.data.list
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: arr1 // 需要预览的图片http链接列表
    })
  },
  preview: function () {
    let that = this
    let current = that.data.list2[0]
    let arr1 = that.data.list2
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: arr1 // 需要预览的图片http链接列表
    })
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
    } else {
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
    let that = this
    let page = that.data.page
    that.setData({
      page: 0,
      doctors: []
    })
    wx.stopPullDownRefresh();
    setTimeout(
      function () {
        that.getDoctors(that.data.id, 0);

      }, 500
    )
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this
    let page = that.data.page
    page++
    wx.stopPullDownRefresh();
    setTimeout(
      function () {
        that.getDoctors(that.data.id, page);
        that.setData({
          page: page
        })
      }, 500
    )
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
      path: '/pages/hosdetail/hosdetail?recommend=' + recommend + '&id=' + id,
    }
  }
})