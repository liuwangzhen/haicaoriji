// pages/hosdetail/hosdetail.js
const myFirst = require('../../utils/myfirst');
const myfirst = new myFirst()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height4: getApp().globalData.height,
    hospital:"",
    rotate:false,
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   let that=this
   let id=options.id
   that.setData({
     id:options.id
   })
    that.getHospital(59863,id)
    that.getDoctors()
  },
  goRotate: function () {
    let that = this;
    let rotate = that.data.rotate
    that.setData({
      rotate: !rotate
    })
  },
  getQualification:function(){
    let that=this
    let list = that.data.hospital.qualification
    let list2=new Array
    for(let i=0;i<list.length;i++){
       list[i]=list[i].path
       list2.push(list[i])
       
    }
    that.setData({
      list2:list2
    })
  },
  getHospital:function(a,b){
    return new Promise(
      (resolve,reject)=>{
        let that = this
        myfirst.getRecord(a, b).then(
          res => {
            that.setData({
              hospital: res.data,
              score:Math.round(res.data.score)
            })
            resolve(that.getQualification())
          },
          err=>{
            reject(err)
          }
        )
      }
    )
  },
  goDoctors:function(){
     let that=this
     wx.navigateTo({
       url: '../doctor/doctor?hospital_id='+that.data.id,
     })
  },
  getDoctors:function(){
    let that=this
    let tableId=59866
    let id=that.data.id
    let a='hospital_id'
    let query = new wx.BaaS.Query()
    query.contains(a,id)
    myfirst.getQueryTable(tableId,query).then(
      res=>{
        that.setData({
          doctors:res.data.objects
        })
      }
    )
  },
  preview: function(){
    let that=this
    let current = that.data.list2[0]
    let arr1 = that.data.list2
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls:arr1 // 需要预览的图片http链接列表
    })
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