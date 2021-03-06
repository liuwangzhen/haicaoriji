// pages/mine/mine.js
const app = getApp();
const Page = require('../../utils/ald-stat.js').Page;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    select: "note",
    list:[],
    img2: "",
    sex: "",
    sign: "",
    date: "",
    id: "",
    aid:"",
    page: 0,
    collection: [],
    usercol:[],
    page2:0,
    list2:[],
    attention1:[],
    fans:[1],
    attention2:[1],
    getshare:0,
    height4: getApp().globalData.height,
    isClick:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that=this
    if (options.getshare != undefined) {
      that.setData({
        getshare: options.getshare,
      })
    }
    this.setData({
      aid: parseInt(options.id)
    })
    
    this.getUserInfo();
    this.getFans();
  },
  goback:function(){
    wx.navigateBack({
      delta:1,
    })
  },
  goIndex:function(){
     wx.switchTab({
       url: '../indexo/indexo',
     })
  },
  getFans(){
    let that=this
    let aid=that.data.aid
   
    let query = new wx.BaaS.Query()
    query.compare('created_by', '=', aid)
    let Product = new wx.BaaS.TableObject(56146)
    Product.setQuery(query).find().then(res => {
      // success
      that.setData({
        recordID:res.data.objects[0].id,
        fans:res.data.objects[0].fans,
      })
      
    }, err => {
      // err
    })

  },
  tab(event) {
    var that = this;
    var temp = event.currentTarget.dataset.id
    this.setData({
      select: temp,

    })
    if (temp == 'note') {
      this.getList();
    } else {
      that.getcol()
    }

  },
  attention:function(){ 
    let that=this
    let MyUser = new wx.BaaS.User()
    let currentUser = MyUser.getCurrentUserWithoutData()
    let aid=that.data.aid
    let attent
    let attention=that.data.attention1.concat(aid)
    currentUser.set('attention', attention).update().then(res => {
      if (res.data.attention.indexOf(that.data.aid) > -1) {
        attent = 1
      } else {
        attent = 0
      }
      let recordID = that.data.recordID
     
      let Product = new wx.BaaS.TableObject(56146)
      let product = Product.getWithoutData(recordID)
      let mid = that.data.mid
     
      let fans = that.data.fans.concat(mid)
     
      product.set('fans', fans)
      product.update().then(res => {
        // success
        
        that.setData({
          fans: res.data.fans
        })
      }, err => {
        // err
      })
     
      that.setData({
        
        attention1: res.data.attention,
        attent: attent,
      })

    })
  },
  cancel:function(){

    let that = this
    let MyUser = new wx.BaaS.User()
    let currentUser = MyUser.getCurrentUserWithoutData()
    let aid = that.data.aid
    let attent
    let attention = that.data.attention1
    let idx=attention.indexOf(aid)
    attention.splice(idx,1)

    currentUser.set('attention', attention).update().then(res => {
      if (res.data.attention.indexOf(that.data.aid) > -1) {
        attent = 1
      } else {
        attent = 0
      }
      let recordID = that.data.recordID

      let Product = new wx.BaaS.TableObject(56146)
      let product = Product.getWithoutData(recordID)
      let mid = that.data.mid
      let fans = that.data.fans
      let index=fans.indexOf(mid)
      fans.splice(index,1)

      product.set('fans', fans)
      product.update().then(res => {
       
        that.setData({
          fans: res.data.fans
        })
      }, err => {
        // err
      })
      that.setData({
        attention1: res.data.attention,
        attent: attent,
      })
    })
  },
  getUserInfo: function() {
    let that = this
    let MyUser = new wx.BaaS.User()
    let id = that.data.aid

    MyUser.get(id).then(res => {

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
        nick: res.data.nick,
        usercol:res.data.collection,
        
        attention2:res.data.attention,

      })
     
      wx.setNavigationBarTitle({
        title: res.data.nick //页面标题为路由参数
      })
      that.getList()
    }, err => {
      // err
    })
  },
  getUserInfoByToken: function() {
    let that = this
    let MyUser = new wx.BaaS.User()
    let attent
    wx.BaaS.login(false).then(res => {
      that.setData({
        mid:res.id
      })
      MyUser.get(res.id).then(res => {
        let id = that.data.aid
        if (res.data.is_authorized == false) {
        // if (res.data.jundge == false) {
          wx.redirectTo({
            url: '../../pages/login4/login4?id=' + id,
          })
        }
        if(res.data.attention.indexOf(that.data.aid)>-1){
          attent=1
        }else{
          attent=0
        }
        that.setData({
          collection: res.data.collection,
          attention1:res.data.attention,
          attent:attent,
        })
      }, err => {
        // err
      })
    }, err => {
      // 登录失败
    })
  },
  ifcollect: function (e) {
    let that = this
    let isClick = that.data.isClick
    let a = e.currentTarget.dataset.id
    let b = e.currentTarget.dataset.index
    if (isClick == true) {
      that.setData({
        isClick: false
      })
      if (e.currentTarget.dataset.collect == 0) {
        that.collect(a, b)
      }
      else {
        that.nocollect(a, b)
      }
      setTimeout(function () {
        that.setData({
          isClick: true
        })
      }, 500)
    }
  },
  collect: function (a, b) {
    let that = this
    let id = a
    let idx = b
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
    }, err => {
    })
  },
  nocollect: function (a, b) {
    let that = this
    let id = a
    let idx = b
    let collection = that.data.collection
    let distinct = function () {
      let len = collection.length;
      for (let i = 0; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
          if (collection[i] == collection[j]) {
            collection.splice(j, 1);
            len--;
            j--;
          }
        }
      }
      return collection;
    };
    distinct();
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

    }, err => {
      // err
    })

  },
  getList: function() {
    let tableID = 55960
    let that = this
    let Product = new wx.BaaS.TableObject(tableID)
    let list = new Array;
    let query = new wx.BaaS.Query()
    let userId = that.data.aid
    query.compare("created_by", '=', userId)

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
        page: 0
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
  getList2: function() {
    let tableID = 55960
    let that = this
    let Product = new wx.BaaS.TableObject(tableID)
    let list = new Array;
    let page = that.data.page
    page++;
    let query = new wx.BaaS.Query()
    let userId = that.data.aid

    query.compare("created_by", '=', userId)

    Product.setQuery(query).orderBy('-created_at').expand('created_by').limit(10).offset(page * 10).find().then(res => {
      // success

      if (res.data.objects == "") {
        wx.showToast({
          title: '没有更多内容了',
        })
      } else {
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let MyUser = new wx.BaaS.User()
    let that = this
    wx.BaaS.login(false).then(res => {
      MyUser.get(res.id).then(res => {
        that.setData({
          collection: res.data.collection
        })


      }, err => {
        // err
      })
      // 登录成功

    }, err => {
      // 登录失败
    })
    this.getUserInfoByToken()
  },
  getcol: function() {
    let tableID = 55960
    let that = this
    let usercol = that.data.usercol
    
    let query = new wx.BaaS.Query()
    query.in('id', usercol)
    let Product = new wx.BaaS.TableObject(tableID)
    let list = new Array;
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
        list2: list,
        page: 1
      })
      



    }, err => {
      // err
    })
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */


  /**
   * 生命周期函数--监听页面显示
   */


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
    wx.stopPullDownRefresh();
    var that = this;

    setTimeout(function() {
      if (that.data.select == 'note') {
        that.getList();
      } else {
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
  onReachBottom: function() {
    let that = this;

    wx.stopPullDownRefresh();

    setTimeout(function() {
      if (that.data.select == 'note') {

        that.getList2();
      } else {
        // that.getCollects2();
      }
      wx.showToast({
        title: '正在加载',
        duration: 2000,

      })
    }, 500);

  },
  ifcollect2: function (e) {
    let that = this
    let isClick = that.data.isClick
    let a = e.currentTarget.dataset.id
    let b = e.currentTarget.dataset.index
    if (isClick == true) {
      that.setData({
        isClick: false
      })
      if (e.currentTarget.dataset.collect == 0) {
        that.collect2(a, b)
      }
      else {
        that.nocollect2(a, b)
      }
      setTimeout(function () {
        that.setData({
          isClick: true
        })
      }, 500)
    }
  },
  collect2: function (a,b) {
    let that = this
    let id = a
    let idx = b
    let collection = that.data.collection.concat(id)
    let MyUser = new wx.BaaS.User()
    let currentUser = MyUser.getCurrentUserWithoutData()
    let list = that.data.list2
    let obj = list[idx]
    currentUser.set('collection', collection).update().then(res => {
      obj.collect = 1;
      obj.collection = parseInt(obj.collection) + 1;
      let collection = obj.collection
      list.splice(idx, 1, obj)
      that.setData({
        list2: list
      })
      that.getUserInfoByToken()
      that.updatacollect(id, collection)
    
    }, err => {
      // err
    })
  },
  nocollect2: function (a,b) {
   
    let that = this
    let id = a
    let idx =b
    let collection = that.data.collection
    let index = collection.indexOf(id)
    let list = that.data.list2
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
        list2: list
      })
      that.getUserInfoByToken()
      that.updatacollect(id, collection)
     
    }, err => {
      // err
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(e) {
    let that=this
    let aid=that.data.aid
      return {
        title: '海草日记',
      desc: '最具人气的小程序开发联盟!',
      path: '/pages/userinfo/userinfo?id='+aid+"&getshare="+1,
    }
  }
})