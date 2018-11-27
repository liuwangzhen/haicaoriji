// pages/indexo/indexo.js
const Page = require('../../utils/ald-stat.js').Page;
const Poster = require('../../utils/poster');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    arr2: [],
    swiperIndex: 0,
    arr1: 1539847068639177,
    inputShowed: false,
    inputVal: "",
    page: 0,
    showModal: false,
    collection: [],
    height4: getApp().globalData.height,
    isClick: true,
    bgImg: "../../images/bg.jpg",  //背景图
    dataImg: "../../images/pic01.jpg",   //内容缩略图
    ewrImg: "",  //小程序二维码图片
    isMakingPoster: true,
    canvas: {
      width: 370,
      height: 500,
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    const params = {
      scene: 'Bdfd',
      page: 'pages/indexo/indexo',
      width: 250
    }
    wx.BaaS.getWXACode('wxacodeunlimit', params).then(res => {
      console.log(res)
      this.setData({
        ewrImg: res.image
      })
      that.btnchose();
    }).catch(err => {})
    let MyUser = new wx.BaaS.User()
    wx.BaaS.login(false).then(res => {
      MyUser.get(res.id).then(res => {
        that.setData({
          collection: res.data.collection
        })
        if (res.data.is_authorized == false) {
          // if (res.data.jundge == false) {
          wx.redirectTo({
            url: '../../pages/login/login',

          })
        }
        that.getList()
      }, err => {
        // err
      })
      // 登录成功
    }, err => {
      // 登录失败
    })
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
    let val = this.data.inputVal
    wx.navigateTo({
      url: '../search/search?val=' + val,
    })
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
          // if (res.data.jundge == false) {
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
  change: function(e) {
    let that = this;
    let index = e.currentTarget.dataset.idx;
    let arr1 = e.currentTarget.dataset.arr;
    that.setData({
      swiperIndex: index,
      arr1: arr1
    })
    that.getCont();
  },
  goDetail: function(e) {
    console.log(e)
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
      console.log(res)
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
    Product.orderBy('-created_at').expand('created_by').limit(50).offset(0).find().then(res => {
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
  },
  LimitNumbersadf(txt) {
    var str = txt;
    str = str.substr(0, 13);
    str += '...'
    return str;
  },
  userinfo: function(e) {
    console.log(e)
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
  getList2: function() {
    let tableID = 55960
    let that = this
    let Product = new wx.BaaS.TableObject(tableID)
    let list = new Array;
    let page = that.data.page
    page++;
    Product.orderBy('-created_at').expand('created_by').limit(50).offset(page * 50).find().then(res => {
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
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
   

    // context.setStrokeStyle("black")
    // context.setLineWidth(2)
    // context.moveTo(160, 100)
    // context.arc(100, 100, 60, 0, 2 * Math.PI, true)
    // context.moveTo(140, 100)
    // context.arc(100, 100, 40, 0, Math.PI, false)
    // context.moveTo(85, 80)
    // context.arc(80, 80, 5, 0, 2 * Math.PI, true)
    // context.moveTo(125, 80)
    // context.arc(120, 80, 5, 0, 2 * Math.PI, true)
    // context.stroke()
  
  },
  btnchose:function(){
    let that=this
    let ewrImg = that.data.ewrImg
    var ctx = wx.createCanvasContext('firstCanvas')
    ctx.drawImage("../../images/bg.jpg", 10, 10, 355, 400)
    ctx.draw()
    ctx.setFontSize(30)
    ctx.setFillStyle('white')
    ctx.fillText('海草日记小程序', 40, 40)
    ctx.draw(true)
    ctx.drawImage(ewrImg,215,260,150,150)
    ctx.draw(true)
    

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getUserInfoByToken()

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
    var that = this;
    setTimeout(function() {
      that.getList();
      wx.showToast({
        title: '我们为您精心挑选了以下文章',
        duration: 3000,
        icon: 'none',
      })
      // wx.showModal({
      //   title: '标题',
      //   content: '这里是内容',
      //   showCancel: false, //不显示取消按钮
      //   confirmText: '确定'
      // })
    }, 500);

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;

    that.getList2();
  },

  /**
   * 用户点击右上角分享
   */
  go: function () {
    this.setData({
      showModal: false
    })
  },
  submit:function(){
    this.setData({
      showModal: true
    })
  },
  onShareAppMessage: function(res) {
   
   
        return {
          title: '海草日记',
          desc: '最具人气的小程序开发联盟!',
          path: '/pages/indexo/indexo',
        }
    
    }
})