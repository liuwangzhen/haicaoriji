// pages/audio/audio.js
const myFirst = require('../../utils/myfirst');
const myfirst = new myFirst()
const backgroundAudioManager = wx.getBackgroundAudioManager()

Page({

  /**
   * 页面的初始数据
   */
  data: {
   music:false,
   poster:[],
   audios:[],
   page:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that=this
    wx.showShareMenu({
      withShareTicket: true
    })
    this.getAudioAd().then(
      res=>{
        that.getAudios()
      }
    )
  },
  getAudioAd:function(){
    let that=this
    return new Promise(
      (resolve,reject)=>{
        let query = new wx.BaaS.Query()
        query.isNotNull("advertisement")
        myfirst.getTableSelect(62000, 9, 0, 'advertisement', ['id','advertisement','poster'], query).then(
          res => {
            that.setData({
              poster:res.data.objects
            })
            resolve()
          })
      }
    )
  },
  goAudioDe:function(e){
     let that=this
     let id=e.currentTarget.dataset.id
     wx.navigateTo({
       url: '../audioDetail/audioDetail?id='+id,
     })
  },
  
  getAudios:function(){
    let that=this
    let page=that.data.page
    return new Promise(
      (resolve,reject)=>{
        let query = new wx.BaaS.Query()
        query.isNotNull("title")
        myfirst.getTableSelect(62000, 10, page*10, 'advertisement', ['id', 'title','times', 'advertisement', 'poster', 'synopsis', 'browse','music'], query).then(
          res => {
            that.setData({
              audios: that.data.audios.concat(res.data.objects)
            })
            resolve()
          })
      }
    )
  },
  forEa:function(){
    let that=this
    let a=that.data.audios
    for(let i=0;i<a.length;i++){
      that.getTime(i)
    }
  },
  getTime:function(i){
    let that=this
    let ass=that.data.audios
    backgroundAudioManager.src=ass[i].music.path
    console.log(backgroundAudioManager.duration)
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
    let that=this
    wx.getStorage({
      key: 'audioId',
      success: function(res){
        if(res.data[0]!=undefined){
          let a=!res.data[2]
            that.setData({
               music:true,
               musicId:res.data[0],
               musicUrl:res.data[4],
               canRotate:a
            })
          if (wx.getBackgroundAudioManager().paused == true) {
            that.setData({
              canRotate: false
            })
           if(res.data[5]==true)
            {
            wx.setStorage({
              key: 'audioId',
              data: [res.data[0], true, true, res.data[3], res.data[4],false],
            })
            }
          }
          if(wx.getBackgroundAudioManager().paused == undefined){
            that.setData({
              canRotate: false
            })
            wx.setStorage({
              key: 'audioId',
              data: [res.data[0],true,true,res.data[3],res.data[4]],
            })
          }
        }
      },
    })
  },
   goMusic:function(){
   let that=this
   let id=that.data.musicId
   wx.navigateTo({
     url: '../audioDetail/audioDetail?id='+id,
   })
 },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    let that = this
    if (that.data.canRotate == true){
    wx.getStorage({
      key: 'audioId',
      success: function(res) {
        wx.setStorage({
          key: 'audioId',
          data: [res.data[0], res.data[1], res.data[2], res.data[3], res.data[4],true],
        })
      },
    })
    }
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
    let that=this
    that.setData({
      page: 0,
      audios: []
    })
    wx.stopPullDownRefresh();
    setTimeout(
      function () {
        that.getAudios();
      }, 200
    )
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let that=this
    let page=that.data.page
    page++
    that.setData({
      page:page
    })
    wx.stopPullDownRefresh();
    setTimeout(
      function () {
        that.getAudios();
      }, 200
    )
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(e) {
    let that=this
    return {
      title: '海草日记',
      desc: '最具人气的小程序开发联盟!',
      path: '/pages/audio/audio',
    }
  }
})