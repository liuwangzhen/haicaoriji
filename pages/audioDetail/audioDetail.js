// pages/audioDetail/audioDetail.js
const myFirst = require('../../utils/myfirst');
const myfirst = new myFirst()
const backgroundAudioManager = wx.getBackgroundAudioManager()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    audio:"",
    start: 0,
    end: 200,
    canSlider: true,
    value: 0,
    canPlay:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    that.setData({
      audioid:options.id
    })
   
          that.getAudio(options.id).then(
            res => {
              that.playBack()
            }
          )
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  getAudio:function(a){
    let that = this
    return new Promise(
      (resolve, reject) => {
        let query = new wx.BaaS.Query()
        myfirst.getRecord(62000, a, 1, 0, 'created_at').then(
          res => {
            that.setData({
             audio:res.data
            })
            resolve()
          })
      }
    )
  },
  // 音频播放
  playBack: function () {
    let that = this
    backgroundAudioManager.title = that.data.audio.title
    backgroundAudioManager.epname = that.data.audio.title
    backgroundAudioManager.singer = that.data.audio.name
    backgroundAudioManager.coverImgUrl = that.data.audio.poster.path
    // 设置了 src 之后会自动播放
    backgroundAudioManager.src = that.data.audio.music.path
    backgroundAudioManager.onCanplay(() => {
      that.setData({
        value: parseInt(backgroundAudioManager.currentTime),
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
    backgroundAudioManager.onPlay(
      () => {
        console.log("play")
        that.setData({
          canPlay: false,
          canSlider: false,
        })
      }
    )
  },
  back:function(){
    let that = this
    backgroundAudioManager.seek(backgroundAudioManager.currentTime - 10)
  },
  Pause: function () {
    let that = this
    backgroundAudioManager.pause()
    backgroundAudioManager.onPause(
      ()=>{
        that.setData({
          canPlay:true,
          canSlider: true,
        })
      }
    )
  },
  seek: function () {
    let that = this
    backgroundAudioManager.seek(backgroundAudioManager.currentTime + 10)

  },
  slider4change: function (e) {
    backgroundAudioManager.seek(parseInt(e.detail.value))
    
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