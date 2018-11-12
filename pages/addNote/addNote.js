// pages/addNote/addNote.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arr1:[],
    addDetail:"",
    check:true,
    content:"",
    height4: getApp().globalData.height,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  previewImage:function(e){
    console.log(e)
    let current=e.currentTarget.dataset.item
    let arr1=this.data.arr1
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: arr1 // 需要预览的图片http链接列表
    })
  },
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
  delete:function(e){
  
    var that=this;
    let id = e.currentTarget.dataset.id;
   
    var arr1 = that.data.arr1.splice(id,1);
   
    that.setData({
      arr1: that.data.arr1
    })
    if (that.data.arr1.length < 9) {
      that.setData({
        check: true
      })
    } 
  },
  add: function () {
    var that = this;
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log(res)
        let imgs = res.tempFilePaths[0]
        for (var i = 0; i < res.tempFilePaths.length; i++) {
          let MyFile = new wx.BaaS.File()
          let fileParams = { filePath: res.tempFilePaths[i] }
          let metaData = { categoryName: 'SDK' }
          MyFile.upload(fileParams, metaData).then(e => {
            that.setData({
              arr1: that.data.arr1.concat(e.data.path)
            })
           
            if (that.data.arr1.length>=9)
            {
               that.data.arr1.splice(9,9)
              that.setData({
                check: false,
                arr1:that.data.arr1
              })
              
            } 
            


          }, err => {

          })
        }
      }
    })
  },
  content: function (e) {
    var that = this;

    var value = e.detail.value;
    // let str = value.split('\n').join('&hc')

    // value = value.replace(/\ /g, "");
    this.setData({
      content: value
    })
  },
  submit: function () {
    let tableID = 55960
    let Product = new wx.BaaS.TableObject(tableID)
    let product = Product.create()
    let that = this
    setTimeout(
      function(){
    let arr1 = that.data.arr1
    let content=that.data.content
    let address=that.data.addDetail
    let apple = {
      img: arr1,
      content: content,
      address:address,
    }
    if (that.data.arr1 == '' || that.data.content == ''){
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
    product.set(apple).save().then(res => {
      
      wx.showToast({
        title: '提交成功..',
        icon: 'success',
        duration: 4000,
        success: function (res) {
          that.setData({
            arr1: [],
            addDetail: "",
            check: true,
            content: "",
          })
          wx.switchTab({
            url: '../../pages/mine/mine',
          })
        }
      })
    })}
     else if (res.cancel) {}
        
      }
          })
        }
      },100
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