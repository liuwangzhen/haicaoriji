// pages/audio/audio.js

const backgroundAudioManager = wx.getBackgroundAudioManager()

Page({

  /**
   * 页面的初始数据
   */
  data: {
   start:0,
   end:200,
   canSlider:true,
   value:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  playBack:function(){
    let that=this
    backgroundAudioManager.title = '恶作剧'
    backgroundAudioManager.epname = '恶作剧之吻'
    backgroundAudioManager.singer = '蓝音'
    backgroundAudioManager.coverImgUrl = 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000'
    // 设置了 src 之后会自动播放
    backgroundAudioManager.src = 'https://cloud-minapp-21181.cloud.ifanrusercontent.com/1ggRaDTO41bnXhx4.mp3'
    backgroundAudioManager.onCanplay(()=>{
      that.setData({
        canSlider: false,
        end: parseInt(backgroundAudioManager.duration)
      })
      backgroundAudioManager.onTimeUpdate(
        () => {
          that.setData({
            value: parseInt(backgroundAudioManager.currentTime)
          })
        }
      )
    })
  },
  pause:function(){
    let that=this
    backgroundAudioManager.pause()
  },
  seek:function(){
    let that=this
    backgroundAudioManager.seek(backgroundAudioManager.currentTime+10)
    
  },
  slider4change:function(e){
   backgroundAudioManager.seek(parseInt(e.detail.value))
  
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

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