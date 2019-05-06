// pages/addNote/addNote.js
import regeneratorRuntime from '../../utils/runtime'
var app = getApp();
const Page = require('../../utils/ald-stat.js').Page;
const myFirst = require('../../utils/myfirst');
const myfirst = new myFirst()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arr1: [],
    arr2: [],
    arr3: [],
    addDetail: "",
    check: true,
    content: "",
    height4: getApp().globalData.height,
    focus1: true,
    focus2: false,
    focus3: false,
    height4: getApp().globalData.height,
    isMakingPoster: false,
    imgList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getUserInfoByToken();
    wx.hideShareMenu()
  },
  // 得到个人信息
  getUserInfoByToken: function() {
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
  // 预览
  previewImage: function(e) {
    let current = e.currentTarget.dataset.item
    let arr1 = this.data.arr1
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: arr1 // 需要预览的图片http链接列表
    })
  },
  // 位置选择
  addDetail() {
    var _this = this
    wx.chooseLocation({
      success(res) {
        _this.setData({
          addDetail: res.address,
        })
      }
    })
  },
  // 去除图片
  delete: function(e) {
    var that = this;
    let id = e.currentTarget.dataset.id;
    var arr1 = that.data.arr1.splice(id, 1);
    that.setData({
      arr1: that.data.arr1
    })
    if (that.data.arr1.length < 9) {
      that.setData({
        check: true
      })
    }
  },
  // 图片添加
  add: function() {
    var that = this;
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        that.setData({
          arr1: that.data.arr1.concat(res.tempFilePaths)
        })
        if (that.data.arr1.length >= 9) {
          that.data.arr1.splice(9, 9)
          that.setData({
            check: false,
            arr1: that.data.arr1
          })
        }
      }
    })
  },
  // 添加内容
  content: function(e) {
    var that = this;
    var value = e.detail.value;
    this.setData({
      content: value,
      focus1: true,
      focus2: false,
      focus3: false,
    })
  },
  // 提交
  submit: function() {
    let that = this
    return new Promise(
      (resolve, reject) => {
        if (that.data.arr1 == '' || that.data.content == '') {
          wx.showToast({
            title: '请输入完整',
            icon: "none",
            duration: 2000
          })
        } else {
          wx.showModal({
            title: "提示",
            content: '确认发布',
            success: function(res) {
              if (res.confirm) {
                that.setData({
                  isMakingPoster: true,
                })
                that.updataImg().then(
                  res => {
                    let arr = that.data.imgList.sort(that.compare('idx')).map(
                      item=>{return item.path}
                    )
                    that.setData({
                      imgList:arr
                    })
                  }
                ).then(
                  res=>{that.createdRecord()
                  }
                ).catch(
                  err=>{
                    that.setData({
                      isMakingPoster: false
                    })
                      wx.showToast({
                        title: '上传失败,请稍后再试',
                        icon:"none",
                      })
                  }
                )
              }
            }
          })
        }
      }
    )
  },
//  提交上传
  createdRecord: function() {
    let that = this
    return new Promise(
      (resolve, reject) => {
        let tableID = 55960
        let Product = new wx.BaaS.TableObject(tableID)
        let product = Product.create()
        // 设置方式一
        let arr2 = that.data.imgList

        let address = that.data.addDetail
        let apple = {
          img: arr2,
          content: that.data.content,
          address: address,
          author_head: that.data.author_head,
          author_name: that.data.author_name,
        }
        product.set(apple).save().then(res => {
          wx.showToast({
            title: '提交成功..',
            icon: 'success',
            duration: 2000,
            success: function(res) {
              that.setData({
                isMakingPoster: false,
                arr1: [],
                addDetail: "",
                check: true,
                content: "",
                imgList: [],
              })
              wx.switchTab({
                url: '../../pages/indexo/indexo',
              })
              resolve(res)
            }
          })
        })
      }
    )
  },
  // 上传图片
  updataImg: function() {
    let that = this
    let arr = that.data.arr1
    let list = new Array
    return new Promise(
      (resolve, reject) => {
        for (let i = 0; i < arr.length; i++) {
          myfirst.upload(arr[i], 'cirtical').then(
            res => {
              list[i] = {
                "idx": i,
                "path": res.data.path
              }
              that.setData({
                imgList: that.data.imgList.concat(list[i])
              })
              if (that.data.imgList.length == arr.length) {
                resolve()
              }
            }
          )
        }
      }
    )
  },
  // 比较
  compare(property) {
    return function(a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return value1 - value2;
    }
  },
  
  focusText: function(e) {
    let that = this
    that.setData({
      height2: e.detail.height
    })
  },
  focusChange: function() {
    let that = this
    that.setData({
      focus1: false,
      focus2: true,
      focus3: true,
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
    this.getUserInfoByToken();
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