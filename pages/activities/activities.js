// pages/activities/activities.js
const myFirst = require('../../utils/myfirst');
const myfirst = new myFirst()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activies:[],
    curId:0,
    recommend:999,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    if (options.recommend != undefined) {
      that.setData({
        recommend: options.recommend
      })
    }
    that.getToken().then(
      res=>{
        that.getActivies().then(
          res => {
            that.getPosters().then(
              res=>{
                that.getImageIn()
              }
            )
          }
        )
      }
    )
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
            if (res.data.is_authorized == false) {
              // if (res.data.jundge == false) {
              wx.redirectTo({
                url: '../../pages/login/login?recomId=' + that.data.recommend,
              })
            }
            resolve(res)
          }
        )
      }
    )
  },
  /**得到所有活动 */
  getActivies:function(){
    return new Promise(
      (resolve,reject)=>{
        let that = this
        let query = new wx.BaaS.Query()
        query.isNotNull('activity')
        myfirst.getTableSelect(59863, 20, 0, '-updated_at', ['name', 'headimg','activity', 'public','id'], query).then(
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
  getPosters:function(){
    return new Promise(
      (resolve,reject)=>{
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
          posters: list
        })
        resolve()
      }
    )
  },
  
  preview: function (e) {
    let that=this
    let current = e.currentTarget.dataset.path
    let posters=that.data.posters
    let arr1=posters.map(function(item){
      return item.path
    })
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: arr1 // 需要预览的图片http链接列表
    })
  },
  goHospital:function(e){
    let that=this
    let id=e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../hosdetail/hosdetail?id='+id,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  change: function (e) {
    let that = this
    let i = e.detail.current
    that.setData({
      current: i,
      curId: i
    })
    wx.getImageInfo({
      src: that.data.posters[i].path,
      success: function (res) {
        that.setData({
          height: res.height / res.width,
        })
      }
    })
  },
  getImageIn:function(){
    let that=this
    wx.getImageInfo({
      src: that.data.posters[0].path,
      success: function (res) {
        that.setData({
          height: res.height / res.width,
        })
      }
    })
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
  onShareAppMessage: function(){
    let that = this
    let recommend = that.data.recomId
    return {
      title: '海草日记',
      desc: '最具人气的小程序开发联盟!',
      path: '/pages/activities/activities?recommend=' + recommend,
    }
  }
})