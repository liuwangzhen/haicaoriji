// pages/search/search.js
const app = getApp();
const Page = require('../../utils/ald-stat.js').Page;
const myFirst=require('../../utils/myfirst.js')
const myfirst=new myFirst()
Page({

  /**
   * 页面的初始数据
   */
  data: {
     apple:"",
     inputVal:"",
     inputShowed:false,
     title:"",
     page:0,
    collection: [],
    list:[],
    doctors:[],
    hospital:[],
    getshare:0,
    height4: getApp().globalData.height,
    isClick:true,
    jundge:0,
    titles: [{ id: 0, title: "笔记" }, { id: 1, title: "医院" }, { id: 2, title: "医生" },],
    curId:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
  chose:function(e){
    let that=this
    let idx=e.currentTarget.dataset.id
    if(that.data.inputVal==""){
      wx.showToast({
        title: '请输入关键字',
        icon:"none"
      })
    }
    else{
    that.setData({
      curId:idx,
      page:0,
      jundge:0,
      list:[],
      hospital:[],
      doctors:[]
    })
    if(idx==0){
      that.getList()
    }
    if (idx == 1) {
      that.getHospital()
    }
    if(idx==2){
      that.getDoctor()
    }
    }
  },
  getDoctor:function(){
    let that=this
    let page=that.data.page
    let query = new wx.BaaS.Query()
    let query2 = new wx.BaaS.Query()
    query.contains('name', that.data.inputVal)
    query2.contains('hospital_name', that.data.inputVal)
    let andQuery = wx.BaaS.Query.or(query, query2)
    let order='created_at'
    myfirst.getQueryTable(59866, andQuery, 20, page*20, order).then(
      res=>{
        that.setData({
          doctors: that.data.doctors.concat(res.data.objects),
          jundge:1,
        })
        if(res.data.objects==""){
          wx.showToast({
            title: '亲，(╯-╰) 没有啦',
            icon: 'none',
            duration: 400
          })
        }
      },
   err=>{
      that.setData({
        jundge:2
      })
      wx.showToast({
        title: '加载失败，请检查网络',
        icon:"none",
        duration: 400
      })
    }
    )
  },
  getHospital:function(){
    let that = this
    let query = new wx.BaaS.Query()
    let order = 'created_at'
    let page=that.data.page
    query.contains('name', that.data.inputVal)
    myfirst.getQueryTable(59863, query, 20, page*20, order).then(
      res => {
        that.setData({
          hospital: that.data.hospital.concat(res.data.objects),
          jundge:1,
        })
        if (res.data.objects == "") {
          wx.showToast({
            title: '亲，(╯-╰) 没有啦',
            icon: 'none',
            duration: 400
          })
        }
      },
      err => {
        that.setData({
          jundge: 2
        })
        wx.showToast({
          title: '加载失败，请检查网络',
          icon: "none",
          duration: 400
        })
      }
    )
  },
  search:function(){
    let that=this
    wx.pageScrollTo({
      scrollTop: 0
    })
    that.setData({
      jundge:0,
      list: [],
      hospital: [],
      doctors: []
    })
     let idx=that.data.curId
    if (idx == 0) {
      that.getList()
    }
    if (idx == 1) {
      that.getHospital()
    }
    if (idx == 2) {
      that.getDoctor()
    }
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
  
  getList: function () {
    let tableID = 55960
    let that = this
    let query = new wx.BaaS.Query()
    let apple = that.data.inputVal;
    let page=that.data.page
    query.contains('content', apple)
    myfirst.getQueryTable(tableID,query,20,page*20,'created_at').then(
      res=>{
        if (res.data.objects == "") {
          wx.showToast({
            title: '亲，(╯-╰) 没有啦',
            icon: 'none',
            duration:400
          })
          that.setData({
            jundge: 2,
            title: that.data.inputVal,
          })
        }
        else{
          that.setData({
            list:that.data.list.concat(res.data.objects),
            jundge:1
          })
        }
      },
      err => {
        that.setData({
          jundge: 2
        })
        wx.showToast({
          title: '加载失败，请检查网络',
          icon: "none",
          duration: 400
        })
      }
    )
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
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
   let that=this
   let page=that.data.page
   that.setData({
    page:0,
    list:[]
   })
    wx.stopPullDownRefresh();
    setTimeout(function () {
      let idx = that.data.curId
      if (idx == 0) {
        that.getList()
      }
      if (idx == 1) {
        that.getHospital()
      }
      if (idx == 2) {
        that.getDoctor()
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
    let that=this
    let page=that.data.page
    page++
    that.setData({
      page:page
    })
    wx.stopPullDownRefresh();
    setTimeout(function(){
      let idx = that.data.curId
      if (idx == 0) {
        that.getList()
      }
      if (idx == 1) {
        that.getHospital()
      }
      if (idx == 2) {
        that.getDoctor()
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
    let that=this
    let val=that.data.title
    let recommend=getApp().globalData.userId
    return {
      title: '海草日记',
      desc: '最具人气的小程序开发联盟!',
      path: '/pages/indexo/indexo?recommend='+recommend,
    }
  }
})