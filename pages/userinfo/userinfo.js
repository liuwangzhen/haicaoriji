// pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    select: "note",
    notes: "",
    img2: "",
    sex: "",
    sign: "",
    date: "",
    id:"",
    page:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.setData({
      id:options.id
    })
    this.getUserInfo();
    this.getNote();
  },
  tab(event) {
    var temp = event.currentTarget.dataset.id
    this.setData({
      select: temp,

    })

  },
  getUserInfo: function () {
    let that = this
    let MyUser = new wx.BaaS.User()
    let id=that.data.id
  
      MyUser.get(id).then(res => {
      
        // success
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
        that.setData({
          userInfo: res.data,
          img2: res.data.headimg.replace(/\"/g, ""),
          index: res.data.gender,
          date: dateformat,
          sign: res.data.sign,
          nick:res.data.nick,
        })
        
        wx.setNavigationBarTitle({
          title: res.data.nick//页面标题为路由参数
        })
      }, err => {
        // err
      })
     
    
  },
  getNote: function () {
    var that = this;
    // 实例化查询对象
    let query = new wx.BaaS.Query()
    
    let userId = parseInt(that.data.id)
    query.compare("created_by", '=',userId)
    let Product = new wx.BaaS.TableObject(55960)
    Product.setQuery(query).orderBy('-created_at').limit(6).offset(0).find().then(res => {
     
      that.setData({
        notes: res.data.objects,
        page:0
      })
     
    }, err => {
      // err
    })

  },
  getNote2: function () {
    var that = this;

    let query = new wx.BaaS.Query()
    let userId = parseInt(that.data.id)
    query.compare("created_by", '=', userId)

    let Product = new wx.BaaS.TableObject(55960)
    let page = that.data.page
    page++;
    Product.setQuery(query).orderBy('-created_at').limit(6).offset(page * 6).find().then(res => {
      console.log(res)
      if (res.data.objects == "") {
        wx.showToast({
          title: '没有更多数据了',
        })
      } else {
        that.setData({
          notes: that.data.notes.concat(res.data.objects),
          page: page,
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
    this.getNote();
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
    wx.stopPullDownRefresh();
    var that = this;

    setTimeout(function () {
      if (that.data.select == 'note') {
        that.getNote();
      }
      else {
        // that.getCollects();
      }
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
    let that = this;
    wx.stopPullDownRefresh();
    setTimeout(function () {
      if (that.data.select == 'note') {

        that.getNote2();
      }
      else {
        // that.getCollects2();
      }
      wx.showToast({
        title: '正在加载',
        duration: 2000,

      })
    }, 500);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})