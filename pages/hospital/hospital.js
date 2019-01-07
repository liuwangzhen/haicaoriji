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
    tableId: 61848,
    idx:0,
    title: [{ id: 61848, name: "项目", src: "../../images/ren.png" }, { id: 1, name: "药品", src: "../../images/yaowan.png" }, { id: 2, name: "材料", src: "../../images/cailiao.png" }, { id: 3, name: "仪器", src: "../../images/yiqi.png" },],
    proTwo:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that=this
    that.getHospital()
    that.getToken()
    
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
              recomId: res.data.id
            })
            resolve(res)
          }
        )
      }
    )
  },
  getHospital: function() {
    let that = this
    return new Promise(
      (resolve,reject)=>{
        myfirst.getTable(59863,10,0,'-score').then(
          (res)=>{
            that.setData({
              list:res.data.objects,
              page:0,
            })
            resolve()
          }
        )
      }
    )
  },
  getHospital2: function () {
    let that = this
    let page=that.data.page
    page++
    return new Promise(
      (resolve, reject) => {
        myfirst.getTable(59863, 10, page*10, '-score').then(
          (res) => {
            if(res.data.objects==""){
              wx.showToast({
                title: '亲，(╯-╰) 没有啦',
                icon: 'none',
              })
            }
            that.setData({
              list: that.data.list.concat(res.data.objects),
              page:page
            })
            resolve()
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
    wx.showToast({
      title: '正在刷新',
      duration:300,
    })
    setTimeout(
      function () {
        that.getHospital();
      }, 500
    )
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let that=this
    wx.stopPullDownRefresh();
    setTimeout(
      function(){
        that.getHospital2();
      },500
    )
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