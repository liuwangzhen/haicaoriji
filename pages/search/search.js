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
    collection: [],
    list:[],
    getshare:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let that = this
    if (options.getshare != undefined) {
      that.setData({
        getshare: 1
      })
    }
    this.setData({
      inputVal:options.val,
      title:options.val,
    })
    this.getList();
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
  
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  getUserInfoByToken() {
    let MyUser = new wx.BaaS.User()
    let that = this
    wx.BaaS.login(false).then(res => {

      MyUser.get(res.id).then(res => {

        // success
        that.setData({
          collection: res.data.collection
        })

        if (res.data.is_authorized == false) {
          wx.redirectTo({
            url: '../../pages/login/login',

          })
        }
        
      }, err => {
        // err
      })
      // 登录成功

    }, err => {
      // 登录失败
    })

  },
  change: function (e) {
    let that = this;

    let index = e.currentTarget.dataset.idx;
    let arr1 = e.currentTarget.dataset.arr;
    that.setData({
      swiperIndex: index,
      arr1: arr1
    })
    that.getCont();

  },

  collect: function (e) {

    let that = this
    let id = e.currentTarget.dataset.id
    let idx = e.currentTarget.dataset.index
    let collection = that.data.collection.concat(id)
    let MyUser = new wx.BaaS.User()
    let currentUser = MyUser.getCurrentUserWithoutData()
    let list = that.data.list
    let obj = list[idx]

    currentUser.set('collection', collection).update().then(res => {
      obj.collect = 1;
      obj.collection = parseInt(obj.collection) + 1;
      let collection = obj.collection
      list.splice(idx, 1, obj)
      that.setData({
        list: list
      })
      that.getUserInfoByToken()
      that.updatacollect(id, collection)
      // wx.showToast({
      //   title: '收藏成功',
      //   icon: 'success',
      //   duration: 2000
      // })

    }, err => {
      // err
    })
  },
  updatacollect: function (id, collection) {
    let tableID = 55960
    let recordID = id

    let Product = new wx.BaaS.TableObject(tableID)
    let product = Product.getWithoutData(recordID)

    product.set('collection', collection)
    product.update().then(res => {
      // success

    }, err => {
      // err
    })
  },
  nocollect: function (e) {
    let that = this
    let id = e.currentTarget.dataset.id
    let idx = e.currentTarget.dataset.index
    let collection = that.data.collection
    let index = collection.indexOf(id)
    let list = that.data.list
    let obj = list[idx]
    collection.splice(index, 1);
    let MyUser = new wx.BaaS.User()
    let currentUser = MyUser.getCurrentUserWithoutData()
    currentUser.set('collection', collection).update().then(res => {
      // success
      obj.collect = 0;
      obj.collection = parseInt(obj.collection) - 1;
      let collection = obj.collection
      list.splice(idx, 1, obj)
      that.setData({
        list: list
      })
      that.getUserInfoByToken()
      that.updatacollect(id, collection)
      // wx.showToast({
      //   title: '取消成功',
      //   icon: 'success',
      //   duration: 2000

      // })
    }, err => {
      // err
    })
  },
  getList: function () {
    let tableID = 55960
    let that = this
    let Product = new wx.BaaS.TableObject(tableID)
    let list = new Array;
    let query = new wx.BaaS.Query()
    let apple = that.data.inputVal;
    query.contains('content', apple)
    Product.setQuery(query).orderBy('-created_at').expand('created_by').limit(10).offset(0).find().then(res => {
      // success
      let list0 = res.data.objects

      for (var i = 0; i < res.data.objects.length; i++) {

        let collection = that.data.collection

        if (collection.indexOf(list0[i].id) > -1) {
          list0[i].collect = 1;

          list0[i].content = that.LimitNumbersadf(list0[i].content);
          list.push(list0[i]);

        } else {
          list0[i].collect = 0;
          list0[i].content = that.LimitNumbersadf(list0[i].content);
          list.push(list0[i]);
        }

      }


      that.setData({
        list: list,
        page: 0,
        title: that.data.inputVal,
      })

    }, err => {
      // err
    })
  },
  LimitNumbersadf(txt) {

    var str = txt;
    str = str.substr(0, 25);
    str += '...'
    return str;
  },
  userinfo: function (e) {
    console.log(e)
    let id = e.currentTarget.dataset.user
    if (id == getApp().globalData.userId) {
      wx.switchTab({
        url: '../mine/mine',
      })
    }
    else {
      wx.navigateTo({
        url: '../userinfo/userinfo?id=' + id,
      })
    }
  },
  getList2: function () {
    let tableID = 55960
    let that = this
    let Product = new wx.BaaS.TableObject(tableID)
    let list = new Array;
    let query = new wx.BaaS.Query()
    let apple = that.data.inputVal;
    query.contains('content', apple)
    let page = that.data.page
    page++;

    Product.setQuery(query).orderBy('-created_at').expand('created_by').limit(10).offset(page * 10).find().then(res => {
      // success

      if (res.data.objects == "") {
        wx.showToast({
          title: '没有更多内容了',
        })
      }
      else {
        let list0 = res.data.objects
        for (var i = 0; i < res.data.objects.length; i++) {
          let collection = that.data.collection
          if (collection.indexOf(list0[i].id) > -1) {
            list0[i].collect = 1;
            list0[i].content = that.LimitNumbersadf(list0[i].content);
            list.push(list0[i]);
          } else {
            list0[i].collect = 0;
            list0[i].content = that.LimitNumbersadf(list0[i].content);
            list.push(list0[i]);
          }
        }
        that.setData({
          list: that.data.list.concat(list),
          page: page
        })
      }

    }, err => {
      // err
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let MyUser = new wx.BaaS.User()
    let that = this
    wx.BaaS.login(false).then(res => {

      MyUser.get(res.id).then(res => {
        // success

        that.setData({
          collection: res.data.collection
        })
        if (res.data.is_authorized == false) {
          wx.redirectTo({
            url: '../../pages/login/login',

          })
        }
        this.getList()


      }, err => {
        // err
      })
      // 登录成功

    }, err => {
      // 登录失败
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
    let that=this
    let val=that.data.title
   
    return {
      title: '荔枝医美',
      desc: '最具人气的小程序开发联盟!',
      path: '/pages/search/search?val='+val+"&getshare="+1,
    }
  }
})