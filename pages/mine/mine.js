// pages/mine/mine.js
const app = getApp();
const Page = require('../../utils/ald-stat.js').Page;
var ex = require('../../common/common.js')
const myDate = new Date()
const myFirst = require('../../utils/myfirst.js')
const myfirst = new myFirst();
const today = myDate.toLocaleDateString(); //获取当前日期
// const today = '2018/12/2';     //获取当前日期


Page({

  /**
   * 页面的初始数据
   */
  data: {
    select: "collect",
    list: [],
    ishavecollect: true,
    list2: [],
    img: "",
    sign: "",
    date: "",
    page: 0,
    page2: 0,
    collection: [],
    aid: "",
    attention: [1],
    fans: [1],
    height4: getApp().globalData.height,
    isClick: true,
    isAdmin: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.getInfo();
    let that = this
    // that.getUserInfoByToken().then(
    //   res => {
    //     that.getAdmin().then(
    //       res=>{
    //         that.getcol()
    //       }
    //     )
    //   }
    // );
    that.getUserInfoByToken().then(
       r=>{ that.getAdmin()}
    ).then(r=>{that.getcol()}).catch(
      err=>{console.log(err)}
    );
    wx.hideShareMenu();
  },
  updata: function() {
    wx.navigateTo({
      url: '../updata/updata',
    })
  },
  goChose: function() {
    wx.navigateTo({
      url: '../chose/chose',
    })
  },
  tab(event) {
    var that = this;
    var temp = event.currentTarget.dataset.id
    this.setData({
      select: temp,
      page:0,
      list:[],
      list2:[],
    })
    if (temp == 'note') {
      this.getList();
    } else {
      that.getcol()
    }
  },
  getUserInfoByToken: function() {
    let that = this
    return new Promise(
      (resolve, reject) => {
        let MyUser = new wx.BaaS.User()
        wx.BaaS.login(false).then(res => {
          MyUser.get(res.id).then(res => {
            let id = res.data.id
            if (res.data.is_authorized == false) {
              wx.redirectTo({
                url: '../../pages/login4/login4?id=' + id,
              })
            }
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
            let timestamp2 = new Date().getTime();
            let timestamp3 = new Date(res.data.birthday).getTime();
            let age = Math.floor((timestamp2 - timestamp3) / 31536000000);
            that.setData({
              userInfo: res.data,
              img2: res.data.headimg.replace(/\"/g, ""),
              index: res.data.gender,
              date: dateformat,
              sign: res.data.sign,
              nick: res.data.nick,
              collection: res.data.collection,
              aid: res.data.id,
              attention: res.data.attention,
              age: age,
            })
            resolve(res)
          }, err => {
            // err
          })
        }, err => {
          // 登录失败
        })
      })
  },
  ifcollect: function(e) {
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
      } else {
        that.nocollect(a, b)
      }
      setTimeout(function() {
        that.setData({
          isClick: true
        })
      }, 500)
    }
  },
  collect: function(a, b) {
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
  updatacollect: function(id, collection) {
    let tableID = 55960
    let recordID = id
    let Product = new wx.BaaS.TableObject(tableID)
    let product = Product.getWithoutData(recordID)
    product.set('collection', collection)
    product.update().then(res => {}, err => {})
  },
  nocollect: function(a, b) {
    let that = this
    let id = a
    let idx = b
    let collection = that.data.collection
    let distinct = function() {
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
    let page = that.data.page
    let Product = new wx.BaaS.TableObject(tableID)
    let list = new Array;
    let query = new wx.BaaS.Query()
    let userId = getApp().globalData.userId
    query.compare("created_by", '=', userId)
    Product.setQuery(query).orderBy('-created_at').expand('created_by').limit(10).offset(page * 10).find().then(res => {
      if (res.data.objects == "") {
        wx.showToast({
          title: '没有更多内容了',
          icon: "none"
        })
      }
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
        ishavecollect: false,
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
  userinfo: function(e) {
    let id = e.currentTarget.dataset.user
    if (id == getApp().globalData.userId) {
      wx.switchTab({
        url: '../mine/mine',
      })
    } else {
      wx.navigateTo({
        url: '../userinfo/userinfo?id=' + id,
      })
    }
  },
  
  // chankanshifouguanliyaun
  getAdmin: function() {
    let that = this
    let aid = that.data.aid
    let query = new wx.BaaS.Query()
    query.compare('adminid', '=', aid)
    return new Promise(
      (resolve, reject) => {
        myfirst.getTableSelect(58773, 200, 0, 'created_at', 'adminid', query).then(
          res => {
            if (res.data.objects != "") {
              that.setData({
                isAdmin: true
              })
            }
            resolve(res)
          }
        )
      }
    )
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  onShow: function() {
    let MyUser = new wx.BaaS.User()
    let that = this
    wx.BaaS.login(false).then(res => {
      MyUser.get(res.id).then(res => {
        that.setData({
          collection: res.data.collection
        })
        // this.getcol()
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
    let page = that.data.page
    let collection = that.data.collection
    let query = new wx.BaaS.Query()
    query.in('id', collection)
    let Product = new wx.BaaS.TableObject(tableID)
    let list = new Array;
    Product.setQuery(query).orderBy('-created_at').expand('created_by').limit(10).offset(page * 10).find().then(res => {
      let list = res.data.objects
      if (res.data.objects == "") {
        wx.showToast({
          title: '没有更多内容了',
          icon: "none"
        })
      }
     
        that.setData({
          list2: that.data.list2.concat(list),
          ishavecollect: false,
          // isno: false,
        })
        console.log(that.data.ishavecollect)
      if (that.data.list2 == 0) {
        that.setData({
          isno: true,
        })
      } 
    }, err => {
      // err
      console.log("err")
    })
  },
  
  nocollect2: function(e) {
    let that = this
    let id = e.currentTarget.dataset.id
    let num = e.currentTarget.dataset.num
    let collection = that.data.collection
    let distinct = function() {
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
    collection.splice(index, 1);
    let MyUser = new wx.BaaS.User()
    let currentUser = MyUser.getCurrentUserWithoutData()
    currentUser.set('collection', collection).update().then(res => {
      num = parseInt(num) - 1
      that.getUserInfoByToken()
      that.getcol();
      that.updatacollect(id, num)
    }, err => {
      // err
    })
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
    wx.stopPullDownRefresh();
    let that = this;
    let isAdmin = that.data.isAdmin
    let select=that.data.select
    that.setData({
      page: 0,
      list:[],
      list2:[],
    })
    if (isAdmin == true && select == 'note') {
      setTimeout(function () {
        that.getList()
      }, 200)
    } else {
      setTimeout(function () {
        console.log(that.data.page)
        that.getcol()
      }, 200)
    }

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let that = this;
    let isAdmin=that.data.isAdmin
    let select = that.data.select
    wx.stopPullDownRefresh();
    let page = that.data.page
    page++
    that.setData({
      page: page
    })
    if (isAdmin == true && select == 'note') {
      setTimeout(function() {
        console.log(that.data.page)
        that.getList()
      }, 200)
    } else {
      setTimeout(function() {
        that.getcol()
      }, 200)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
  }
})