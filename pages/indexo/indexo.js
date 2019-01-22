// pages/indexo/indexo.js
import regeneratorRuntime from '../../utils/runtime'
const Page = require('../../utils/ald-stat.js').Page;
const myFirst=require('../../utils/myfirst.js')
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    swiperIndex: 0,
    inputShowed: false,
    inputVal: "",
    page: 0,
    collection: [],
    height4: getApp().globalData.height,
    isClick: true,
    search:" ",
    search2:" ",
    ewrImg: "",  //小程序二维码图片
    tphone:"",
    scrolltop:0,
    recomId:999,
    curId:0,
    titles: [{ id: 0, name: "推荐", search: ' ', search2: ',', }, { id: 1, name: "隆鼻", search: "鼻综合", search2: "隆鼻", }, { id: 2, name: "双眼皮", search: "双眼皮", search2: "眼综合" }, { id: 3, name: "脂肪填充", search: "脂肪填充", search2: "脂肪填充" }, { id: 4, name: "吸脂", search: "吸脂", search2: "吸脂", }, { id: 5, name: "瘦脸针", search: "瘦脸针", search2: "瘦脸针", }, { id: 6, name: "玻尿酸", search: "玻尿酸", search2: "玻尿酸", }, { id: 7, name: "水光针", search: "水光针", search2: "水光针", }]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    if (options.recommend!=undefined)
    {
    that.setData({
      recomId:options.recommend
    })
    }
    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          tphone:res
        })
      }
    })
    that.getUserInfoByToken();
    // wx.getMenuButtonBoundingClientRect()
    function sleep() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          that.setData({
            k:20
          })
          resolve(' enough sleep~');
        }, 200);
      })
    }
    function normalFunc() {
      console.log('normalFunc');
    }
    async function awaitDemo() {
      await normalFunc();
      let result =  sleep();
      console.log(that.data.k);// 两秒之后会被打印出来
      console.log("22")
    }
    awaitDemo();


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
    console.log('000')
    this.setData({
      inputVal: e.detail.value
    });

  },
  search: function() {
    console.log('110')
    let val = this.data.inputVal
    wx.navigateTo({
      url: '../search/search?val=' + val,
    })
  },
 
  getUserInfoByToken() {
    let MyUser = new wx.BaaS.User()
    let that = this
    wx.BaaS.login(false).then(res => {
      that.setData({
        recommend:res.id
      })
      MyUser.get(res.id).then(res => {
        // success
        that.setData({
          collection: res.data.collection
        })
        if (res.data.is_authorized == false) {
          // if (res.data.jundge == false) {
          wx.redirectTo({
            url: '../../pages/login/login?recomId=' + that.data.recomId,
          })
        }
        that.getList(" ", " ")
      }, err => {
        // err
      })
      // 登录成功

    }, err => {
      // 登录失败
    })

  },
  change: function(e) {
    let that = this;
    let index = e.currentTarget.dataset.idx;
    let id = e.currentTarget.dataset.id;
    let search=e.currentTarget.dataset.search
    let search2 = e.currentTarget.dataset.searchtwo
    wx.pageScrollTo({
      scrollTop:0
    })
    that.setData({
      swiperIndex: index,
      page:0,
      search:search,
      search2:search2,
      scrolltop:0,
      curId:id,
    })
    that.getList(search,search2);
  },
  

  goDetail: function(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: "../detail/detail?id=" + id
    })
    app.aldstat.sendEvent('笔记' + id, {
      '加入时间': Date.now()
    });
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
  getList: function(a,b) {
    let tableID = 55960
    let that = this
    let Product = new wx.BaaS.TableObject(tableID)
    let list = new Array;
    let query = new wx.BaaS.Query()
    let query2 = new wx.BaaS.Query()
    query.contains('content', a)
    query2.contains('content', b)
    let andQuery = wx.BaaS.Query.or(query, query2)
    if(a==" "){
      Product.orderBy('-created_at').expand('created_by').limit(10).offset(0).find().then(res => {
        let list0 = res.data.objects
        function shuffle(arr) {
          let i = arr.length,
            t, j;
          while (i) {
            j = Math.floor(Math.random() * i--);
            t = arr[i];
            arr[i] = arr[j];
            arr[j] = t;
          }
        }
        shuffle(list0);
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
          list: list,
          page: 0
        })
      }, err => {
        // err
      })
    }
    else{
    Product.orderBy('-created_at').setQuery(andQuery).expand('created_by').limit(10).offset(0).find().then(res => {
      let list0 = res.data.objects
      function shuffle(arr) {
        let i = arr.length,
          t, j;
        while (i) {
          j = Math.floor(Math.random() * i--);
          t = arr[i];
          arr[i] = arr[j];
          arr[j] = t;
        }
      }
      shuffle(list0);
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
        list: list,
        page: 0
      })
    }, err => {
      // err
    })
    }
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
  getList2: function(a,b) {
    let tableID = 55960
    let that = this
    let Product = new wx.BaaS.TableObject(tableID)
    let list = new Array;
    let page = that.data.page
    page++;
    let query = new wx.BaaS.Query()
    let query2 = new wx.BaaS.Query()
    query.contains('content', a)
    query2.contains('content', b)
    let andQuery = wx.BaaS.Query.or(query, query2)
    if(a==" "){
      Product.setQuery(andQuery).orderBy('-created_at').expand('created_by').limit(10).offset(page * 10).find().then(res => {
        // success  
        if (res.data.objects == "") {
          wx.showToast({
            title: '亲，(╯-╰) 没有啦',
            icon: 'none',
          })
        } else {
          let list0 = res.data.objects

          function shuffle(arr) {
            let i = arr.length,
              t, j;
            while (i) {
              j = Math.floor(Math.random() * i--);
              t = arr[i];
              arr[i] = arr[j];
              arr[j] = t;
            }
          }
          shuffle(list0);
          for (var i = 0; i < res.data.objects.length; i++) {
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
            page: page
          })
        }

      }, err => {
        // err
      })
    }
    else{
    Product.setQuery(andQuery).orderBy('-created_at').expand('created_by').limit(10).offset(page * 10).find().then(res => {
      // success  
      if (res.data.objects == "") {
        wx.showToast({
          title: '亲，(╯-╰) 没有啦',
          icon: 'none',
        })
      } else {
        let list0 = res.data.objects

        function shuffle(arr) {
          let i = arr.length,
            t, j;
          while (i) {
            j = Math.floor(Math.random() * i--);
            t = arr[i];
            arr[i] = arr[j];
            arr[j] = t;
          }
        }
        shuffle(list0);
        for (var i = 0; i < res.data.objects.length; i++) {
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
          page: page
        })
      }

    }, err => {
      // err
    })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */

 btnchose:function(e){
   let that = this
   let h1 = that.data.tphone.screenHeight
   let w1 = that.data.tphone.screenWidth
   let ewrImg = that.data.ewrImg
      setTimeout(function(){
      wx.canvasToTempFilePath({
       canvasId: 'firstCanvas',
       width: w1,
       height: h1,
       destWidth: w1 * 2,
       destHeight: h1 * 2,
       fileType: 'jpg',
       quality: 1,
       success: (res) => {
         wx.previewImage({
           urls: [res.tempFilePath]
         });
       }
     })
      },2000)
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
  onPullDown:function(){
    wx.startPullDownRefresh()
  },
  
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh();
    var that = this;
    let a=that.data.search
    let b=that.data.search2
    setTimeout(function() {
      that.getList(a,b);
      wx.showToast({
        title: '我们为您精心挑选了以下文章',
        duration: 3000,
        icon: 'none',
      })
    }, 500);

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    let a = that.data.search
    let b = that.data.search2
    that.getList2(a,b);
  },

  /**
   * 用户点击右上角分享
   */
  onReady: function () {

  },
  onShareAppMessage: function(res) {
   let that=this
   let recommend=that.data.recommend
        return {
          title: '海草日记',
          desc: '最具人气的小程序开发联盟!',
          path: '/pages/indexo/indexo?recommend='+recommend,
        }
    }
})