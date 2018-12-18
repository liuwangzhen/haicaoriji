// pages/chose/chose.js
const myFirst = require('../../utils/myfirst');
const myfirst = new myFirst()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    height4: getApp().globalData.height,
    cdata: [{ id: 9, title: '眼睛' }, { id: 9, title: '嘴巴' }, { id: 9, title: '鼻子' },
      { id: 9, title: '瘦身' }, { id: 9, title: '脸型' }, { id: 9, title: '我最美' },],
      inputVal:"",
  list:[],
  isClick:true,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  goback: function () {
    wx.navigateBack({
      delta: 1,
    })
  },
  ischose:function(e){
     let that=this
     let idx=e.currentTarget.dataset.index
     let a=e.currentTarget.dataset.name
     let list=that.data.list
     let isClick = that.data.isClick
     console.log(that.data.list)
     console.log(a)
     if(isClick==true){
       that.setData({
         isClick: false
       })
       if(list.indexOf(a)>-1){
         that.offchose(idx,a);
       }
       else{
         that.onchose(idx,a);
       }
       setTimeout(function(){
         that.setData({
           isClick:true
         })
       },100)
     }
  },
  onchose:function(idx,a){
      let that=this
      let cdata=that.data.cdata
      cdata[idx].id=idx
      that.setData({
        list:that.data.list.concat(a),
        cdata:cdata,
      })
      console.log(that.data.list)
  },
  offchose:function(idx,a){
    let that = this
    let cdata = that.data.cdata
    cdata[idx].id = 9
    let list=that.data.list
    let num=list.indexOf(a)
    list.splice(num,1)
    that.setData({
      list: list,
      cdata: cdata,
    })
  },
  goIndex: function () {
    wx.switchTab({
      url: '../indexo/indexo',
    })
  },
  inputVal:function(e){
    let that=this
    that.setData({
      inputVal:e.detail.value
    })
  },
  upload:function(){
    let that=this
    let list=that.data.list
    let inputVal=that.data.inputVal
    let a={
      label:list,
      realname:inputVal
    }
    myfirst.renew(a).then(
      res=>{
        console.log(res)
      },err=>{
        console.log(err)
        wx.showToast({
          title: '提交失败',
          icon:"none",
        })
      }
    )
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})