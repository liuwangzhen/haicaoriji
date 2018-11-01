// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     apple:"",
     inputVal:"",
     inputShowed:true,
     title:"",
     page:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      inputVal:options.val,
      title:options.val,
    })
    this.getList();
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
 
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  getList: function () {
    let tableID = 55345
    let that = this
    let query = new wx.BaaS.Query()
    let apple = that.data.inputVal;
    query.contains('content', apple)
    let Product = new wx.BaaS.TableObject(tableID)
   
    Product.setQuery(query).orderBy('-created_at').expand('created_by').limit(6).offset(0).find().then(res => {
    
          that.setData({
            list: res.data.objects,
            title:that.data.inputVal,
            page:0,
          })
        }, err => {
          // err
        }
      )

  },
  getList2: function () {
    let tableID = 55960
    let that = this
    let query = new wx.BaaS.Query()
    let apple = that.data.inputVal;
    query.contains('content', apple)
    let Product = new wx.BaaS.TableObject(tableID)
    let page = that.data.page
    page++;

    Product.orderBy('-created_at').setQuery(query).expand('created_by').limit(6).offset(page * 6).find().then(res => {
      // success

      if (res.data.objects == "") {
        wx.showToast({
          title: '没有更多数据了',
        })
      }
      else {
        that.setData({
          list: that.data.list.concat(res.data.objects),
          page: page
        })
      }

    }, err => {
      // err
    })
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

    wx.stopPullDownRefresh();
    var that = this;

    setTimeout(function () {
      that.getList();
       wx.showToast({
        title: '正在刷新',
        duration: 2000,

      })
    }, 500);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    that.getList2();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})