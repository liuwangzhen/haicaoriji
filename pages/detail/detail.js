// pages/detail/detail.js
import regeneratorRuntime from '../../utils/runtime'
var app = getApp();
const Page = require('../../utils/ald-stat.js').Page;
const myFirst = require('../../utils/myfirst');
const myfirst = new myFirst()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    richTextID: "",
    list: "",
    getlist: [],
    page: 0,
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
    height4: getApp().globalData.height,
    isClick: true,
    isClick2: true,
    phone: null,
    showModal: false,
    tphone: "",
    isMakingPoster: false,
    play: false,
    recomId: 999
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let scene = decodeURIComponent(options.scene)
    console.log(options)
    let time = new Date()
    let that = this;
    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          tphone: res
        })
      }
    })
    // 判断页面的入口，是由海报还是分享朋友或是跳转进入
    if (options.scene != undefined) {
      console.log(options.scene)
      that.setData({
        getshare: 1,
        id: options.scene,
      })
      that.getUserInfoByToken().then(
        res => {
          that.getPic().then(
            res => {
              that.getList();
            }
          )
          that.getEwrimg()
        }
      ).catch(
        err => {
          console.log(err)
        });
    } else {
      if (options.getshare != undefined) {
        console.log(options)
        that.setData({
          getshare: 1,
          recomId: parseInt(options.recommend)
        })
      }
      that.setData({
        id: options.id,
      })
      that.getUserInfoByToken().then(
        res => {
          that.getPic().then(
            res => {
              that.getList();
            }
          );
          that.getEwrimg()
        }
      ).catch(
        err => {
          console.log(err)
        }
      );
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
  bindplay: function() {
    let that = this
    that.setData({
      play: true
    })
  },
  previewImage: function(e) {
    console.log(e.currentTarget.dataset.item)
    let current = e.currentTarget.dataset.item
    let arr1 = this.data.list.img
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: arr1 // 需要预览的图片http链接列表
    })
  },
  gochose: function() {
    wx.navigateTo({
      url: '../chose/chose',
    })
  },
  goCommend: function(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: "../detail/detail?id=" + id
    })
  },
  // 获取分享海报信息
  getPoster: function() {
    let that = this
    that.setData({
      isMakingPoster: true
    })
    let MyTableObject = new wx.BaaS.TableObject(59309)
    MyTableObject.find().then(res => {
      let list0 = res.data.objects
      that.shuffle(list0);
      that.shuffle(list0[0].content)
      let img2 = list0[0].image_all.path
      wx.getImageInfo({
        src: img2,
        success: function(res) {
          that.setData({
            img2: res.path,
            w2: res.width,
            h2: res.height
          })
          setTimeout(function() {
            that.btnchose2();
          }, 500)
        },
        fail: function(res) {
          wx.showToast({
            title: '加载失败，请重新合成',
            success: function() {
              that.setData({
                isMakingPoster: false
              })
            }
          })
        },
      })
    }, err => {
      wx.showToast({
        title: '合成失败，请重新合成',
        success: function() {
          that.setData({
            isMakingPoster: false
          })
        }
      })
    })
  },
  // 生成海报
  btnchose2: function() {
    let that = this
    let h1 = that.data.tphone.screenHeight
    let w1 = that.data.tphone.screenWidth
    let w2 = that.data.w2
    let h2 = that.data.h2
    let ewrImg = that.data.ewrImg
    if (ewrImg == undefined) {
      wx.showToast({
        title: '网络错误',
        icon: "loading"
      })
       that.setData({
         isMakingPoster: false
       })
    } else {
      let Img2 = that.data.img2
      wx.getImageInfo({
        src: Img2,
        success: function(res) {
          that.setData({
            ewrImg2: res.path
          })
          let ewrImg2 = res.path
          let preview = function() {
            return new Promise((resolve, reject) => {
              prew().then((filePath) => {
                wx.previewImage({
                  urls: [filePath]
                });
                resolve();
              }).catch((err) => {
                reject(err);
              });
            });
          }
          let prew = function() {
            return new Promise((resolve, reject) => {
              that.setData({
                isMakingPoster: false
              })
              wx.canvasToTempFilePath({
                canvasId: 'firstCanvas',
                width: w2 / 2,
                height: h2 / 2,
                destWidth: w2,
                destHeight: h2,
                fileType: 'jpg',
                quality: 1,
                success: (res) => {
                  resolve(res.tempFilePath);
                }
              })
            })
          }
          let draw = async function() {
            let ctx = wx.createCanvasContext('firstCanvas', this)
            return ctx.draw(false, await preview())
          }
          let ctx = wx.createCanvasContext('firstCanvas', this)
          let promise = function() {
            return new Promise(
              function(resolve, reject) {
                ctx.drawImage(ewrImg2, 0, 0, w2 / 2, h2 / 2)
                resolve()
              })
          }
          let promise3 = function() {
            return new Promise(
              function(resolve, reject) {
                ctx.drawImage(ewrImg, w2 * 34 / 1000, h2 * 40 / 100, 200, 200)
                resolve()
                reject()
              })
          }
          Promise.all([
            promise(),
            promise3()
          ]).then(
            () =>
            ctx.draw(false, () => {
              preview();
            }), err => {
              wx.showToast({
                title: '合成失败',
                success: function() {
                  that.setData({
                    isMakingPoster: false
                  })
                }
              })
            })
        },
      })
    }
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
  // 获取电话
  getPhoneNumber(e) {
    let that = this
    let isClick = that.data.isClick2
    let b = {
      isGetPhone: false
    }
    if (isClick == true) {
      that.setData({
        isClick2: false
      })
      let a = e.currentTarget.dataset.id
      let encryptedData = e.detail.encryptedData
      let iv = e.detail.iv
      wx.checkSession({　　　
        success: function(res) {　　　　　　
          wx.BaaS.wxDecryptData(encryptedData, iv, 'phone-number').then(decrytedData => {
            console.log(decrytedData)
            let MyUser = new wx.BaaS.User()
            let currentUser = MyUser.getCurrentUserWithoutData()
            // age 为自定义字段
            currentUser.set({
              'phone': decrytedData.phoneNumber,
              'isGetPhone': true
            }).update().then(res => {
              that.collect(a)
              myfirst.renew(b).then(
                res => {
                 
                }
              )
            }, err => {})
          }, err => {
            // 失败的原因有可能是以下几种：用户未登录或 session_key 过期，微信解密插件未开启，提交的解密信息有误
            wx.showToast({
              title: '请重新收藏',
              icon: "none"
            })
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
  // 获取推荐列表
  getList: function() {
    let that = this
    let list = new Array;
    if (that.data.list.video!=undefined) {
      var query1 = new wx.BaaS.Query()
      query1.isNotNull('video')
      var query2 = new wx.BaaS.Query()
      query2.compare('id','!=',that.data.list.id)
      var query = wx.BaaS.Query.and(query1, query2)
    } else {
      var query1 = new wx.BaaS.Query()
      query1.isNull('video')
      var query2 = new wx.BaaS.Query()
      query2.compare('id', '!=', that.data.list.id)
      var query = wx.BaaS.Query.and(query1, query2)
    }
    myfirst.getTableAndQuery(55960, 8, that.data.page, "-created_at", "-address", query).then(
      res => {
        let list0 = res.data.objects
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
          getlist: that.data.getlist.concat(list),
        })
      }
    ).catch(
      err => {
        console.log(err)
      }
    )
  },
// 获取当前文章信息
  getPic: function() {
    let that = this
    return new Promise(
      (resolve, reject) => {
        let tableID = 55960
        let recordID = that.data.id
        let Product = new wx.BaaS.TableObject(tableID)
        Product.get(recordID).then(res => {
          let list = res.data
          let imgs = res.data.img
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
          if (res.data.created_by == getApp().globalData.userId) {
            that.setData({
              candelete: true
            })
          }
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
          that.setData({
            list: list,
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
          resolve(res)
        }, err => {
          reject(err)
        })
      }
    )
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
  // 滑动图片
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
// 判断是否收藏
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
  onShow: function() {},
  getUserInfoByToken() {
    return new Promise(
      (resolve, reject) => {
        let MyUser = new wx.BaaS.User()
        let that = this
        let id = that.data.id
        wx.BaaS.login(false).then(res => {
          MyUser.get(res.id).then(res => {
            if (res.data.is_authorized == false) {
              wx.redirectTo({
                url: '../../pages/login3/login3?id=' + that.data.id + "&recomId=" + that.data.recomId,
              })
            }
            that.setData({
              collection: res.data.collection,
              user: res.data,
              user2Id: res.data.id,
              phone: res.data.phone
            })
            that.getAdmin();
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
  // 获取二维码
  getEwrimg: function() {
    let that = this
    let h1 = that.data.tphone.screenHeight
    let w1 = that.data.tphone.screenWidth
    let scene = that.data.id
    const params = {
      scene: scene,
      page: 'pages/detail/detail',
      width: 250,
      is_hyaline: false,
    }
    wx.BaaS.getWXACode('wxacodeunlimit', params, true, '二维码').then(res => {
      wx.getImageInfo({
        src: res.download_url,
        success: function(res) {
          that.setData({
            ewrImg: res.path
          })
        }
      })
    })
  },
  // 获取管理员信息
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let that = this
    wx.stopPullDownRefresh()
    let page = that.data.page
    page++
    that.setData({
      page: page
    })
    setTimeout(function() {
      that.getList();
    }, 500)
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

  onShareAppMessage: function() {
    let that = this
    let id = that.data.id
    let tableID = 55960
    let recordID = id
    let Product = new wx.BaaS.TableObject(tableID)
    let product = Product.getWithoutData(recordID)
    let share = that.data.share + 1
    let title = that.LimitNumbersadf(that.data.list.content)
    let recommend = that.data.user2Id
    return {
      title: title,
      // desc: '最具人气的小程序',
      path: '/pages/detail/detail?id=' + id + "&getshare=" + 1 + "&recommend=" + recommend,
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