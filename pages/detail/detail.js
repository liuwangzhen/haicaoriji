// pages/detail/detail.js
var app = getApp();
const Page = require('../../utils/ald-stat.js').Page;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    richTextID: "",
    list: "",
    getlist: "",
    id: "",
    nick: "",
    headimg: "",
    count: "",
    current: 0,
    userid: "",
    collection: [0],
    content: "",
    share: 0,
    getshare: 0,
    input: false,
    commentVal: "",
    commentVal2: "",
    focus: false,
    focus2: false,
    input2: false,
    height4: getApp().globalData.height,
    isClick: true,
    isClick2: true,
    phone: null,
    showModal: false,
    tphone: "",
    isMakingPoster: false,
    play:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let scene = decodeURIComponent(options.scene)
    let time = new Date()
    let that = this;
    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          tphone: res
        })
      }
    })
    if (options.scene != undefined) {
      that.setData({
        getshare: 1,
        id: options.scene
      })
      console.log(options.scene)
      console.log(that.data.id)
      that.getUserInfoByToken();
      that.getcomment();
      that.getList();
      app.aldstat.sendEvent('日记打开', {
        '日记id': that.data.id,
        '打开时间': time
      });
    } else {
      if (options.getshare != undefined) {
        that.setData({
          getshare: 1,
        })
      }
      that.setData({
        id: options.id,
      })
      that.getUserInfoByToken();
      that.getcomment();
      that.getList();
      app.aldstat.sendEvent('日记打开', {
        '日记id': that.data.id,
        '打开时间': time
      });
    }
  },
  onShare: function() {
    this.setData({
      showModal: true
    })
  },
  goback: function() {
    wx.navigateBack({
      delta: 1,
    })
  },
  goIndex: function() {
    wx.switchTab({
      url: '../indexo/indexo',
    })
  },
  bindplay:function(){
let that=this
that.setData({
  play:true
})
  },
  previewImage: function(e) {
    let current = e.currentTarget.dataset.item
    let arr1 = this.data.list.img
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: arr1 // 需要预览的图片http链接列表
    })
  },
  goCommend: function(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: "../detail/detail?id=" + id
    })
    app.aldstat.sendEvent('笔记' + id, {
      '加入时间': Date.now()
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let that = this
    let h1 = that.data.tphone.screenHeight
    let w1 = that.data.tphone.screenWidth
    const params = {
      scene: that.data.id,
      page: 'pages/detail/detail',
      width: 250
    }
    wx.BaaS.getWXACode('wxacodeunlimit', params, true).then(res => {
      wx.getImageInfo({
        src: res.download_url,
        success: function(res) {
          that.setData({
            ewrImg: res.path
          })

          //       var ctx = wx.createCanvasContext('firstCanvas', this)
          //       ctx.setFontSize(30)
          //       ctx.setFillStyle('#fff')
          //       ctx.fillText('海草日记小程序', 40, 40)
          //       ctx.drawImage(that.data.ewrImg, w1 / 2, h1 / 2, 150, 150)
          //       ctx.draw(true)
        }
      })
    })
  },
  btnchose: function() {
    let that = this
    let h1 = that.data.tphone.screenHeight
    let w1 = that.data.tphone.screenWidth
    let ewrImg = that.data.ewrImg

    function prew() {
      that.setData({
        isMakingPoster: false
      })
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
    }
    let ctx = wx.createCanvasContext('firstCanvas', this)
    let promise = new Promise(
      function(resolve, reject) {
        that.setData({
          isMakingPoster: true
        })
        setTimeout(
          function() {
            // ctx.drawImage("../../images/bg.jpg", 0, 0, w1, h1)
            ctx.setFillStyle('#f5f5f5')
            ctx.fillRect(0, 0, w1, h1)
            ctx.setFontSize(30)
            ctx.setFillStyle('#d5d5d5')
            ctx.fillText('海草日记小程序', 40, 40)
            ctx.drawImage(that.data.ewrImg, w1 / 2, h1 / 2, 150, 150)
            resolve()
          }, 1000)
      })
    promise.then((res) => ctx.draw(false, () => {
      prew();
    }))
    // setTimeout(
    // , 2000)
  },
  goUser: function() {
    var id = this.data.userid;
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
  getPhoneNumber(e) {
    let that = this
    let isClick = that.data.isClick2
    if (isClick == true) {
      that.setData({
        isClick2: false
      })
      let a = e.currentTarget.dataset.id
      let encryptedData = e.detail.encryptedData
      let iv = e.detail.iv
      wx.checkSession({　　　
        success: function(res) {　　　　　　
          console.log("处于登录态");
          wx.BaaS.wxDecryptData(encryptedData, iv, 'phone-number').then(decrytedData => {
            console.log(decrytedData)
            let MyUser = new wx.BaaS.User()
            let currentUser = MyUser.getCurrentUserWithoutData()
            // age 为自定义字段
            currentUser.set({
              'phone': decrytedData.phoneNumber,
            }).update().then(res => {
              that.collect(a)
            }, err => {})
          }, err => {
            // 失败的原因有可能是以下几种：用户未登录或 session_key 过期，微信解密插件未开启，提交的解密信息有误
          })　　　　
        },
        　fail: function(res) {　
          wx.showToast({
            title: '获取失败，请重新收藏',
            icon: "none",
          })
          console.log("需要重新登录");　　　　　　
          wx.BaaS.logout()
          wx.BaaS.login()　　　
        }　　
      })
      setTimeout(function() {
        that.setData({
          isClick2: true
        })
      }, 3000)
    }
  },
  getList: function() {
    let tableID = 55960
    let that = this
    let Product = new wx.BaaS.TableObject(tableID)
    let list = new Array;
    Product.orderBy('-collection').expand('created_by').limit(50).offset(0).find().then(res => {
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
        getlist: list,
      })
    }, err => {
      // err
    })
  },
  getPic: function() {
    let that = this
    let tableID = 55960
    let recordID = that.data.id
    let Product = new wx.BaaS.TableObject(tableID)
    Product.get(recordID).then(res => {
      let list = res.data
      let collection = that.data.collection
      let i = collection.indexOf(recordID)
      if (i > -1) {
        list.collect = 1;
      } else {
        list.collect = 0;
      }
      var datetime = new Date(res.data.created_at * 1000);
      let id = res.data.created_by
      let MyUser = new wx.BaaS.User()
      that.setData({
        userid: res.data.created_by
      })
      if (that.data.userid == that.data.user2Id) {
        that.setData({
          canDele: true
        })
      }
      // if (res.data.created_by == getApp().globalData.userId) {
      //   that.setData({
      //     candelete: true
      //   })
      // }
      MyUser.get(id).then(res => {
        that.setData({
          headimg: res.data.headimg,
          nick: res.data.nick,
        })
      }, err => {
        // err
      })
      var year = datetime.getFullYear();
      var month = datetime.getMonth() + 1;
      var hours = datetime.getHours();
      var minutes = datetime.getMinutes();
      if (hours <= 9) {
        hours = "0" + hours;
      }
      if (minutes <= 9) {
        minutes = "0" + minutes;
      }
      if (month <= 9) {
        month = "0" + month;
      }
      var date = datetime.getDate();
      if (date <= 9) {
        date = "0" + date;
      }
      var dateformat = year + "-" + month + "-" + date + " " + hours + ":" + minutes;
      // var str = res.data.content.split('↵').join('\n');
      that.setData({
        list: list,
        // content:str,
        share: list.share,
        date: dateformat,
        count: res.data.img.length
      })
      wx.getImageInfo({
        src: res.data.img[0],
        success: function(res) {
          that.setData({
            height: res.height / res.width,
          })
        }
      })

    }, err => {})
  },
  delete: function() {
    let that = this
    wx.showModal({
      title: '提示',
      content: '确认删除',
      success: function(res) {
        if (res.confirm) {
          let tableID = 55960
          let recordID = that.data.id
          let Product = new wx.BaaS.TableObject(tableID)
          Product.delete(recordID).then(res => {
            // success
            wx.switchTab({
              url: '../mine/mine',
            })
          }, err => {
            // err
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  change: function(e) {
    var that = this
    var i = e.detail.current
    that.setData({
      current: i,
    })
    wx.getImageInfo({
      src: that.data.list.img[i],
      success: function(res) {
        that.setData({
          height: res.height / res.width,
        })
      }
    })
  },
  deleteComment: function(e) {
    let that = this
    wx.showModal({
      title: '提示',
      content: '确认删除',
      success: function(res) {
        if (res.confirm) {
          let tableID = 56497
          let recordID = e.currentTarget.dataset.id
          let Product = new wx.BaaS.TableObject(tableID)
          Product.delete(recordID).then(res => {
            that.getcomment();
          }, err => {
            // err
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  ifcollect: function(e) {
    let that = this
    let isClick = that.data.isClick
    let a = e.currentTarget.dataset.id
    if (isClick == true) {
      that.setData({
        isClick: false
      })
      if (e.currentTarget.dataset.collect == 0) {
        that.collect(a)
      } else {
        that.nocollect(a)
      }
      setTimeout(function() {
        that.setData({
          isClick: true
        })
      }, 500)
    }
  },
  collect: function(a) {
    let that = this
    let id = a
    let collection = that.data.collection.concat(id)
    let MyUser = new wx.BaaS.User()
    let currentUser = MyUser.getCurrentUserWithoutData()
    let list = that.data.list
    currentUser.set('collection', collection).update().then(res => {
      list.collect = 1;
      list.collection = parseInt(list.collection) + 1;
      let collection = list.collection
      that.setData({
        list: list
      })
      that.getUserInfoByToken()
      that.updatacollect(collection)
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        duration: 2000
      })
    }, err => {
      // err
    })
  },
  updatacollect: function(collection) {
    let that = this
    let tableID = 55960
    let recordID = that.data.id
    let Product = new wx.BaaS.TableObject(tableID)
    let product = Product.getWithoutData(recordID)
    product.set('collection', collection)
    product.update().then(res => {
      // success
    }, err => {
      // err
    })
  },
  nocollect: function(a) {
    let that = this
    let id = a
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
    // 作孽啊 不能赋值 大爷的
    collection.splice(index, 1);
    let MyUser = new wx.BaaS.User()
    let currentUser = MyUser.getCurrentUserWithoutData()
    let list = that.data.list
    currentUser.set('collection', collection).update().then(res => {
      // success
      list.collect = 0;
      list.collection = parseInt(list.collection) - 1;
      let collection = list.collection
      that.setData({
        list: list
      })
      that.getUserInfoByToken()
      that.updatacollect(collection)
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        duration: 2000
      })
    }, err => {
      // err
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this
    that.getUserInfoByToken();
    that.getcomment();
  },
  getUserInfoByToken() {
    let MyUser = new wx.BaaS.User()
    let that = this
    let id = that.data.id
    wx.BaaS.login(false).then(res => {
      MyUser.get(res.id).then(res => {
        if (res.data.is_authorized == false) {
          // if (res.data.jundge == false) {
          wx.redirectTo({
            url: '../../pages/login3/login3?id=' + that.data.id,
          })
        }
        that.setData({
          collection: res.data.collection,
          user: res.data,
          user2Id: res.data.id,
          phone: res.data.phone
        })
        that.getPic();
        that.getAdmin();
      }, err => {
        // err
      })
      // 登录成功

    }, err => {
      // 登录失败
    })
  },
  getAdmin: function() {
    let that = this
    let tableID = 58773
    let user2Id = that.data.user2Id
    let Product = new wx.BaaS.TableObject(tableID)
    let arr = new Array
    Product.find().then(res => {
      let list = res.data.objects
      for (let i = 0; i < list.length; i++) {
        list[i] = list[i].adminid
        arr.push(list[i])
      }
      if (arr.indexOf(user2Id) > -1) {
        that.setData({
          candelete: true
        })
      }
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  LimitNumbersadf(txt) {
    var str = txt;
    str = str.substr(0, 10);
    str += '...'
    return str;
  },
  comment: function() {
    let that = this
    that.setData({
      input: true,
      focus: true,
      input2: false,
      input4: false,
    })

  },
  send: function() {
    let that = this
    setTimeout(
      function() {
        if (that.data.commentVal == "") {
          wx.showToast({
            title: '评论不能为空',
            icon: "none"
          })
          //  that.setData({
          //    input: true,
          //    focus:true,
          //  })
        } else {
          let comment = that.data.commentVal
          let cid = that.data.id
          let tableID = 56497
          let Product = new wx.BaaS.TableObject(tableID)
          let product = Product.create()
          let apple = {
            comment: comment,
            cid: cid,
          }
          product.set(apple).save().then(res => {
            that.getcomment()
            that.setData({
              input: false,
              commentVal: "",
            })
          }, err => {
            //err 为 HError 对象
          })
        }
      }, 200)
  },
  inputVal: function(e) {
    this.setData({
      commentVal: e.detail.value,
      input: false,
    });
  },
  focusInput: function(e) {
    this.setData({
      height2: e.detail.height,
    })
  },
  focusInput2: function(e) {
    this.setData({
      height3: e.detail.height,
    })
  },
  inputVal2: function(e) {
    this.setData({
      commentVal2: e.detail.value,
      input2: false,
    });
  },

  answer: function(e) {
    let that = this
    let coid = e.currentTarget.dataset.id
    that.setData({
      input2: true,
      focus2: true,
      input: false,
      input3: false,
      coid: coid
    })
  },
  moveOut: function() {
    let that = this;
    that.setData({
      input: false
    })
  },
  sendanswer: function() {
    let that = this
    setTimeout(
      function() {
        if (that.data.commentVal2 == "") {
          wx.showToast({
            title: '回复不能为空',
            icon: "none"
          })
        } else {

          let comment = that.data.commentVal2
          let cid = that.data.coid
          let tableID = 56584
          let Product = new wx.BaaS.TableObject(tableID)
          let product = Product.create()
          let apple = {
            answer: comment,
            cid: cid,
          }
          product.set(apple).save().then(res => {
            that.getcomment()
            that.setData({
              input2: false,
              commentVal2: "",
            })
          }, err => {})
        }
      }, 200)
  },
  sendanswer2: function() {
    let that = this;
    that.setData({
      input2: true,
      input4: false,
      focus4: false,
    })
  },
  getcomment: function() {
    let that = this
    let id = that.data.id
    let query = new wx.BaaS.Query()
    query.compare("cid", "=", id)
    let Product = new wx.BaaS.TableObject(56497)
    let list = new Array
    let list4 = new Array
    Product.setQuery(query).find().then(res => {
      that.setData({
        commentslen: res.data.objects
      })
    }, err => {})
    Product.setQuery(query).orderBy('-created_at').limit(3).offset(0).expand('created_by').find().then(res => {
      let list0 = res.data.objects
      for (let i = 0; i < res.data.objects.length; i++) {
        list0[i].idx = i;
        let i2 = res.data.objects.length - 1
        let query2 = new wx.BaaS.Query()
        query2.compare("cid", "=", list0[i].id)
        let Product2 = new wx.BaaS.TableObject(56584)
        Product2.setQuery(query2).expand('created_by').find().then(e => {
          list0[i].answers = e.data.objects
          list0[i].created_at = that.getDate(list0[i].created_at)
          list.push(list0[i])
          //  if (i == i2){    
          that.setData({
            comments: list.sort(compare('idx'))
          })

          function compare(property) {
            return function(a, b) {
              var value1 = a[property];
              var value2 = b[property];
              return value1 - value2;
            }
          }

          // }
        })
        //  that.getCom(i,i2,list0); 
      }
    }, err => {})
  },
  getCom: function(i, i2, list0) {
    let that = this
    let query2 = new wx.BaaS.Query()
    let list = new Array
    query2.compare("cid", "=", list0[i].id)
    let Product2 = new wx.BaaS.TableObject(56584)
    Product2.setQuery(query2).expand('created_by').find().then(e => {
      list0[i].answers = e.data.objects
      list0[i].created_at = that.getDate(list0[i].created_at)
      list.push(list0[i])
      if (i == i2) {
        that.setData({
          comments: list
        })
      }
    })
  },
  getAllComments: function() {
    let that = this
    let id = that.data.id
    let canDele = that.data.candelete
    wx.navigateTo({
      url: '../comments/comments?id=' + id + "&canDele=" + canDele,
    })
  },
  getDate: function(d) {
    var st = d
    var datetime = new Date(st * 1000);
    var year = datetime.getFullYear();
    var month = datetime.getMonth() + 1;
    var hours = datetime.getHours();
    var minutes = datetime.getMinutes();
    if (hours <= 9) {
      hours = "0" + hours;
    }
    if (minutes <= 9) {
      minutes = "0" + minutes;
    }
    if (month <= 9) {
      month = "0" + month;
    }
    var date = datetime.getDate();
    if (date <= 9) {
      date = "0" + date;
    }
    var dateformat = year + "-" + month + "-" + date + " " + hours + ":" + minutes;
    return dateformat
  },
  go: function() {
    this.setData({
      showModal: false
    })
  },
  getCanvas: function() {
    let that = this
    let h1 = that.data.tphone.screenHeight
    let w1 = that.data.tphone.screenWidth
    const params = {
      scene: '5c00a4cee2146e0ac313b709',
      page: 'pages/detail/detail',
      width: 250
    }
    wx.BaaS.getWXACode('wxacodeunlimit', params, true).then(res => {
      wx.getImageInfo({
        src: res.download_url,
        success: function(res) {
          that.setData({
            ewrImg: res.path
          })
          var ctx = wx.createCanvasContext('firstCanvas', this)
          ctx.drawImage("../../images/bg.jpg", 0, 0, w1, h1)
          ctx.draw()
          ctx.setFontSize(30)
          ctx.setFillStyle('#fff')
          ctx.fillText('海草日记小程序', 40, 40)

          ctx.drawImage(that.data.ewrImg, w1 / 2, h1 / 2, 150, 150)
          ctx.draw(true)
        }

      })
    })
  },
  onShareAppMessage: function() {
    let that = this
    let id = that.data.id
    let tableID = 55960
    let recordID = id
    let Product = new wx.BaaS.TableObject(tableID)
    let product = Product.getWithoutData(recordID)
    let share = that.data.share + 1
    let title = that.LimitNumbersadf(that.data.list.content)
    return {
      title: title,
      // desc: '最具人气的小程序',
      path: '/pages/detail/detail?id=' + id + "&getshare=" + 1,
      imageUrl: that.data.list.img[0],
      success: (e) => {
        product.set('share', share)
        product.update().then(res => {
          // success
          that.setData({
            share: res.data.share
          })
        }, err => {
          // err
        })

      },
    }
  }
})