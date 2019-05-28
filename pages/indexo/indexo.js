// pages/indexo/indexo.js
import regeneratorRuntime from '../../utils/runtime'
const Page = require('../../utils/ald-stat.js').Page;
const myFirst = require('../../utils/myfirst.js')
const myfirst = new myFirst()
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    swiperIndex: 1,
    inputShowed: false,
    inputVal: "",
    page: 0,
    collection: [],
    height4: getApp().globalData.height,
    isClick: true,
    search: " ",
    search2: " ",
    tphone: "",
    recomId: 999,
    titles: [{
      id: 99,
      name: "视频",
    }, {
      id: 0,
      name: "推荐",
    }, {
      id: 1,
      name: "隆鼻",
      search: "鼻综合",
      search2: "隆鼻",
    }, {
      id: 2,
      name: "双眼皮",
      search: "双眼皮",
      search2: "眼综合"
    }, {
      id: 3,
      name: "脂肪填充",
      search: "脂肪填充",
      search2: "脂肪填充"
    }, {
      id: 4,
      name: "吸脂",
      search: "吸脂",
      search2: "吸脂",
    }, {
      id: 5,
      name: "瘦脸针",
      search: "瘦脸针",
      search2: "瘦脸针",
    }, {
      id: 6,
      name: "玻尿酸",
      search: "玻尿酸",
      search2: "玻尿酸",
    }, {
      id: 7,
      name: "水光针",
      search: "水光针",
      search2: "水光针",
    }]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    if (options.recommend != undefined) {
      that.setData({
        recomId: options.recommend
      })
    }
    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          tphone: res
        })
      }
    })
    that.getUserInfoByToken().then(
      res=>{
        let query = new wx.BaaS.Query()
        query.isNull('video')
        that.getList(query);
      }
    ).catch(
      err=>{
        console.log(err)
      }
    );
  },
  showInput: function() {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function() {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function() {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function(e) {
    this.setData({
      inputVal: e.detail.value
    });

  },
  search: function() {
    let that = this
    let val = this.data.inputVal
    wx.navigateTo({
      url: '../search/search?val=' + val,
    })
  },
// 获取信息
  getUserInfoByToken() {
    let that=this
    return new Promise(
      (resolve,reject)=>{
    let MyUser = new wx.BaaS.User()
    let that = this
    wx.BaaS.login(false).then(res => {
      that.setData({
        recommend: res.id
      })
      MyUser.get(res.id).then(res => {
        // success
        that.setData({
          collection: res.data.collection
        })
        if (res.data.is_authorized == false) {
          wx.redirectTo({
            url: '../../pages/login/login?recomId=' + that.data.recomId,
          })
        }
        resolve()
      }, err => {
        // err
      })
      // 登录成功

    }, err => {
      // 登录失败
    })
      }
    )

  },
  // shoucang
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
      wx.showToast({
        title: '收藏成功',
        icon:'success'
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
      obj.collect = 0;
      obj.collection = parseInt(obj.collection) - 1;
      let collection = obj.collection
      list.splice(idx, 1, obj)
      that.setData({
        list: list
      })
      wx.showToast({
        title: '取消收藏',
        icon: 'success'
      })
      that.getUserInfoByToken()
      that.updatacollect(id, collection)

    }, err => {
      // err
    })

  },
  // 菜单切换
  change: function(e) {
    let that = this;
    let index = e.currentTarget.dataset.idx;
    let id = e.currentTarget.dataset.id;
    that.setData({
      swiperIndex: index,
      page: 0,
      noMore:false,
      list:[],
    })
    wx.pageScrollTo({
      scrollTop: 0
    })
    if (index != 0 && index != 1) {
      let search = e.currentTarget.dataset.search
      let search2 = e.currentTarget.dataset.searchtwo
      that.setData({
        search: search,
        search2: search2,
      })
      let query = new wx.BaaS.Query()
      let query2 = new wx.BaaS.Query()
      let query3 = new wx.BaaS.Query()
      query.contains('content', search)
      query2.contains('content', search2)
      query3.isNull('video')
      let andQuery = wx.BaaS.Query.or(query, query2)
      let andQuery2 = wx.BaaS.Query.and(andQuery,query3)
      that.getList(andQuery2);
    } else if(index==1) {
      let query = new wx.BaaS.Query()
      query.isNull('video')
      that.getList(query);
     }else{
      let query = new wx.BaaS.Query()
      query.isNotNull('video')
      that.getList(query);
     }
  },
// 跳转详情页
  goDetail: function(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: "../detail/detail?id=" + id
    })
  },
  // 随机排序
  shuffle: function(arr) {
    let i = arr.length,
      t, j;
    while (i) {
      j = Math.floor(Math.random() * i--);
      t = arr[i];
      arr[i] = arr[j];
      arr[j] = t;
    }
  },
  // 获取文章列表
  getList: function(query) {
    let that = this
    let list = new Array;
    if (that.data.list.length > 0) {
      wx.showLoading()
    }
    myfirst.getTableAndQuery(55960, 6, that.data.page, '-created_at', '-address', query).then(
      res => {
        let list0 = res.data.objects
        if(list0.length<6){
          that.setData({
            noMore:true
          })
        }else{
          that.setData({
            noMore: false
          })
        }
        that.shuffle(list0);
        for (let i = 0; i < res.data.objects.length; i++) {
          let collection = that.data.collection
          if (collection.indexOf(list0[i].id) > -1) {
            list0[i].collect = 1;
            list.push(list0[i]);
          } else {
            list0[i].collect = 0;
            list.push(list0[i]);
          }
        }
        that.setData({
          list: that.data.list.concat(list),
        })
        wx.hideLoading()
      }
    ).catch(
      err => {
        console.log(err)
        wx.hideLoading()
        wx.showToast({
          title: '加载失败',
        })
      }
    )
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */

  onPullDownRefresh: function() {
    wx.stopPullDownRefresh();
    var that = this;
    that.setData({
      page: 0,
      list: [],
    })
    let index=that.data.swiperIndex
    if (index != 0 && index != 1) {
      let search = that.data.search
      let search2 = that.data.search2
      let query = new wx.BaaS.Query()
      let query2 = new wx.BaaS.Query()
      query.contains('content', search)
      query2.contains('content', search2)
      let andQuery = wx.BaaS.Query.or(query, query2)
      that.getList(andQuery);
    } else if (index == 1) {
      let query = new wx.BaaS.Query()
      query.isNull('video')
      that.getList(query);
    } else {
      let query = new wx.BaaS.Query()
      query.isNotNull('video')
      that.getList(query);
    }
    setTimeout(function () {
    }, 500)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    wx.stopPullDownRefresh();
    let page = that.data.page
    page++
    that.setData({
      page: page
    })
    let index = that.data.swiperIndex
    if (index != 0 && index != 1) {
      let search = that.data.search
      let search2 = that.data.search2
      let query = new wx.BaaS.Query()
      let query2 = new wx.BaaS.Query()
      let query3 = new wx.BaaS.Query()
      query.contains('content', search)
      query2.contains('content', search2)
      query3.isNull('video')
      let andQuery = wx.BaaS.Query.or(query, query2)
      let andQuery2 = wx.BaaS.Query.and(andQuery, query3)
      that.getList(andQuery2);
    } else if (index == 1) {
      let query = new wx.BaaS.Query()
      query.isNull('video')
      that.getList(query);
    } else {
      let query = new wx.BaaS.Query()
      query.isNotNull('video')
      that.getList(query);
    }
    setTimeout(function(){

    },500)
  },

  /**
   * 用户点击右上角分享
   */
  onReady: function() {

  },
  onShareAppMessage: function(res) {
    let that = this
    let recommend = that.data.recommend
    if(res.from=='button'){
      return {
        title: res.target.dataset.text,
        desc: '海草日记',
        path: '/pages/detail/detail?id=' + res.target.dataset.content + "&getshare=" + 1 + "&recommend=" + recommend,
        imageUrl: res.target.dataset.img,
      }
    }
    else{
    return {
      title: '海草日记',
      desc: '最具人气的小程序开发联盟!',
      path: '/pages/indexo/indexo?recommend=' + recommend,
    }
    }
  }
})