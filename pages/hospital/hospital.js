// pages/hospital/hospital.js 61848
const myFirst = require('../../utils/myfirst');
const myfirst = new myFirst()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height4: getApp().globalData.height,
    list:[],
    page:0,
    isHospital:true,
    curId:0,
    BigPoster:[],
    tableId: 61848,
    idx:0,
    title: [{ id: 61848, name: "项目", src: "../../images/ren.png" }, { id: 1, name: "药品", src: "../../images/yaowan.png" }, { id: 2, name: "材料", src: "../../images/cailiao.png" }, { id: 3, name: "仪器", src: "../../images/yiqi.png" },],
    proTwo:'',
    serves: [{ id: 0, name: "活动", path: "../../images/active.png" }, { id: 1, name: "医院", path: "../../images/hospital.png" },
    //  { id: 2, name: "百科", path: "../../images/ency.png" }, 
     { id: 3, name: "咨询师", path: "../../images/counselor.png" }, { id: 4, name: "意向", path: "../../images/intent.png" },],
    serveId:0,
    // 意向表
    cdata: [{
      id: 9,
      title: '玻尿酸'
    }, {
      id: 9,
      title: '肉毒素'
    }, {
      id: 9,
      title: '眼部整形'
    },
    {
      id: 9,
      title: '鼻部整形'
    }, {
      id: 9,
      title: '胸部整形'
    }, {
      id: 9,
      title: '医学美肤'
    },
    {
      id: 9,
      title: '面部轮廓'
    },
    {
      id: 9,
      title: '吸脂瘦身'
    },
    ],
    list2:[],
    inputVal: "",
    isClick: true,
    isClick2: true,
    focus2: false,
    elastic: true,
    counselor: '无'
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that=this
    that.getToken()
    that.getBigPoster()
    that.getActivies().then(
      res => {
        that.getPosters();
      }
    )
  },
  getBigPoster:function(){
    let that=this
    return new Promise(
      (resolve,reject)=>{
        myfirst.getTable(62121, 10, 0, 'created_at').then(
          res=>{
            that.setData({
              BigPoster:res.data.objects
            })
          }
        )
      }
    )
  },
  aChange:function(e){
    let that=this
    let isHospital=e.currentTarget.dataset.ex
    console.log(isHospital)
    that.setData({
      isHospital:isHospital
    })
  },
  pickPro:function(e){
    let that=this
    let idx=e.currentTarget.dataset.idx
    that.setData({
      curId:idx,
    })
  },
  getToken() {
    let that = this
    return new Promise(
      (resolve, reject) => {
        myfirst.getUserInfoByToken().then(
          res => {
            that.setData({
              recomId: res.data.id,
              phone: res.data.phone
            })
            resolve(res)
          }
        )
      }
    )
  },
  getHospital: function(){
    let that = this
    let page=that.data.page
    return new Promise(
      (resolve,reject)=>{
        myfirst.getTableSeleNoQuery(59863, 10, page*10, '-score', ['name','headimg','id','address','score']).then(
          (res)=>{
            if(res.data.objects==""){
              wx.showToast({
                title: '亲，已经到底了',
                icon:"none",
              })
            }
            that.setData({
              list:that.data.list.concat(res.data.objects),
            })
            resolve()
          }
        )
      }
    )
  },
  
  getActivies: function () {
    return new Promise(
      (resolve, reject) => {
        let that = this
        let query = new wx.BaaS.Query()
        query.isNotNull('activity')
        myfirst.getTableSelect(59863, 20, 0, '-updated_at', ['name', 'headimg', 'activity', 'public', 'id'], query).then(
          res => {
            that.setData({
              activies: res.data.objects
            })
            resolve()
          }
        )
      }
    )
  },
  getPosters: function () {
    return new Promise(
      (resolve, reject) => {
        let that = this
        let list = new Array
        let activies = that.data.activies
        for (let i = 0; i < activies.length; i++) {
          let poster = activies[i].activity
          for (let k = 0; k < poster.length; k++) {
            poster[k].name = activies[i].name
            poster[k].id = activies[i].id
            poster[k].public = activies[i].public
            poster[k].headimg = activies[i].headimg
            list.push(poster[k])
          }
        }
        that.setData({
          list: list
        })
        resolve()
      }
    )
  },

  preview: function (e) {
    let that = this
    let current = e.currentTarget.dataset.path
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: [current] // 需要预览的图片http链接列表
    })
  },
  getCounselor: function () {
    let that = this
    return new Promise(
      (resolve, rejecct) => {
        myfirst.getTable(60959, 30, 0, 'order').then(
          res => {
            that.setData({
              list: res.data.objects
            })
            resolve(res)
          }
        )
      }
    )
  },
  intervalChange: function (e) {
    let index = e.detail.current
    let that = this
    that.setData({
      counselorId: index
    })
  },
  goCounselor: function (e) {
    let that = this
    let name = e.currentTarget.dataset.name
    let recommend = that.data.recommend
    if (recommend != undefined) {
      wx.navigateTo({
        url: '../chose/chose?name=' + name + '&recommend=' + recommend,
      })
    } else {
      wx.navigateTo({
        url: '../chose/chose?name=' + name,
      })
    }
  },
  serveChange:function(e){
    let that=this
    let tag=e.currentTarget.dataset.tag
    that.setData({
      serveId:tag,
      list:[],
      page:0,
    })
    switch (tag) {
      case 0:
        that.getActivies().then(
          res=>{
            that.getPosters();
          }
        )
        break;
      case 1:
        that.getHospital();
        break;
      case 3:
      that.setData({
        counselorId:0
      })
      that.getCounselor();
      break;
      case 4:
      break;
      // default:
      //   n 与 case 1 和 case 2 不同时执行的代码
    }
  },

  // 意向表
  ischose: function (e) {
    let that = this
    let idx = e.currentTarget.dataset.index
    let a = e.currentTarget.dataset.name
    let list = that.data.list2
    let isClick = that.data.isClick
    if (isClick == true) {
      that.setData({
        isClick: false
      })
      if (list.indexOf(a) > -1) {
        that.offchose(idx, a);
      } else {
        that.onchose(idx, a);
      }
      setTimeout(function () {
        that.setData({
          isClick: true
        })
      }, 100)
    }
  },
  onchose: function (idx, a) {
    let that = this
    let cdata = that.data.cdata
    cdata[idx].id = idx
    that.setData({
      list2: that.data.list2.concat(a),
      cdata: cdata,
    })
  },
  getFocus: function () {
    let that = this
    that.setData({
      focus2: true,
      elastic: false,
    })
  },
  bindfocus: function (e) {
    let that = this
    that.setData({
      height5: e.detail.height
    })
    
  },
  bindblur: function (e) {
    let that = this
    that.setData({
      elastic: true
    })
  },
  offchose: function (idx, a) {
    let that = this
    let cdata = that.data.cdata
    cdata[idx].id = 9
    let list = that.data.list2
    let num = list.indexOf(a)
    list.splice(num, 1)
    that.setData({
      list2: list,
      cdata: cdata,
    })
  },
 
  inputVal: function (e) {
    let that = this
    that.setData({
      inputVal: e.detail.value
    })
  },
  getPhoneNumber(e) {
    let that = this
    let a = e.currentTarget.dataset.id
    let encryptedData = e.detail.encryptedData
    let iv = e.detail.iv
    let list = that.data.list2
    let counselor = that.data.counselor
    let substr = ""
    for (let i = 0; i < list.length; i++) {
      if (i == list.length - 1) {
        substr = substr + list[i]
      }
      else {
        substr = substr + list[i] + ','
      }
    }
    wx.checkSession({
      success: function (res) {
        console.log("处于登录态");
        wx.BaaS.wxDecryptData(encryptedData, iv, 'phone-number').then(decrytedData => {
          console.log(decrytedData)
          let a = {
            'phone': decrytedData.phoneNumber,
            label: substr,
            realname: that.data.inputVal,
            consult: true,
            counselor: counselor,
          }
          let b = {
            consult: false
          }
          myfirst.renew(a).then(
            res => {
              myfirst.renew(b).then(
                res => {
                  wx.showToast({
                    title: '提交成功',
                    icon: "success",
                    duration: 200,
                    success: function () {
                      wx.showModal({
                        title: '提示',
                        content: '感谢提交',
                        showCancel: false,
                        success: function () {
                          wx.navigateBack({
                            delta: 1
                          })
                        },
                      })
                    }
                  })
                }
              )
            },
            err => {
              wx.showToast({
                title: '提交失败',
              })
            }
          )
        }, err => {
          // 失败的原因有可能是以下几种：用户未登录或 session_key 过期，微信解密插件未开启，提交的解密信息有误
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '提交失败，请重试',
          icon: "none",
        })
        console.log("需要重新登录");
        wx.BaaS.logout()
        wx.BaaS.login()
      }
    })
  },
 
  submit: function (e) {
    console.log(e)
    let formID = e.detail.formId
    wx.BaaS.wxReportTicket(formID)
  },
  upload: function () {
    let that = this
    let list = that.data.list2
    let counselor = that.data.counselor
    let substr = ""
    for (let i = 0; i < list.length; i++) {
      if (i == list.length - 1) {
        substr = substr + list[i]
      }
      else {
        substr = substr + list[i] + ','
      }
    }
    let inputVal = that.data.inputVal
    let a = {
      label: substr,
      realname: inputVal,
      consult: true,
      counselor: counselor,
    }
    let b = {
      consult: false
    }
    wx.showModal({
      title: '提示',
      content: '是否确认提交',
      success: function (res) {
        if (res.confirm) {
          myfirst.renew(a).then(
            res => {
              myfirst.renew(b).then(
                res => {
                  wx.showToast({
                    title: '提交成功',
                    icon: "success",
                    duration: 200,
                    success: function () {
                      wx.showModal({
                        title: '提示',
                        content: '感谢提交',
                        showCancel: false,
                        success: function () {
                          wx.navigateBack({
                            delta: 1
                          })
                        },
                      })
                    }
                  })
                }
              )
            }, err => {
              console.log(err)
              wx.showToast({
                title: '提交失败',
                icon: "none",
              })
            }
          )
        } else if (res.cancel) { }
      }
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
    let that = this
    wx.stopPullDownRefresh();
    let serveId = that.data.serveId
    let page = that.data.page
    that.setData({
      page: 0,
    })
    switch (serveId) {
      case 0:
        break;
      case 1:
        setTimeout(
          function () {
            that.setData({
              list:[],
            })
            that.getHospital();
          }, 500
        )
        break;
    }
    wx.showToast({
      title: '正在刷新',
      duration:300,
    })
    // setTimeout(
    //   function () {
    //     that.getHospital();
    //   }, 500
    // )
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let that=this
    wx.stopPullDownRefresh();
    let serveId=that.data.serveId
    let page=that.data.page
    page++
    that.setData({
      page: page
    })
    switch (serveId) {
      case 0:
        break;
      case 1:
        setTimeout(
          function () {
            that.getHospital();
          }, 500
        )
        break;
    }
  },
 
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    let that = this
    let recommend = that.data.recomId
    return {
      title: '海草日记',
      desc: '最具人气的小程序开发联盟!',
      path: '/pages/indexo/indexo?recommend=' + recommend,
    }
  }
})