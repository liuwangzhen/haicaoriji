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
    canSlider: false,
    value: 0,
    canPlay:true,
    stPlay:false,
    currentTime:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    console.log(options.id)
    if(options.recommend != undefined) {
      that.setData({
        recommend: options.recommend
      })
    }
    that.setData({
      audioid:options.id,
    })
    that.getAudios().then(
      res=>{
        that.getAudiosId()
      }
    );
          that.getAudio(options.id).then(
            res => {
              wx.getStorage({
                key: 'audioId',
                complete: function(res) { 
                  if(res.errMsg=="getStorage:ok"){
                  if(options.id==res.data[0]){
                    backgroundAudioManager.onTimeUpdate(
                      () => {
                        that.setData({
                          value: parseInt(backgroundAudioManager.currentTime)
                        })
                      }
                    )
                    that.setData({
                      canSlider: res.data[2],
                      end:res.data[3],
                      canPlay: res.data[1],
                    })
                  }
                  else{
                    that.playBack()
                  }
                  }
                  else{
                    that.playBack()
                  }
                },
              })
            }
          )
    that.getToken() 
  },
  updateBrows:function(){
    let that=this
    let c={
      browse:that.data.audio.browse+1
    }
    myfirst.update(62000,that.data.audioid,c)
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
            that.updateBrows()
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
    backgroundAudioManager.onCanplay(() =>{
      setTimeout(function(){
        that.setData({
          value: parseInt(backgroundAudioManager.currentTime),
          end: parseInt(backgroundAudioManager.duration)
        })
      },100)
    })
    backgroundAudioManager.onTimeUpdate(
      () => {
        that.setData({
          value: parseInt(backgroundAudioManager.currentTime)

        })
      }
    )
    backgroundAudioManager.onPlay(
      () => {
        that.setData({
          canPlay: false,
          canSlider: false,
        })
      }
    )
  },
 
  getAudios: function () {
    let that = this
    return new Promise(
      (resolve, reject) => {
        let query = new wx.BaaS.Query()
        query.isNotNull("title")
        myfirst.getTableSelect(62000, 200, 0, 'advertisement', 'id', query).then(
          res => {
            that.setData({
              audios: res.data.objects
            })
            resolve()
          })
      }
    )
  },
  getAudiosId: function () {
    let that = this
    let list = that.data.audios.map(
      (item) => {
        return item.id
      }
    )
    that.setData({
      listId: list
    })
  },
  next:function(){
    let that=this
    let auid=that.data.audioid
    let list=that.data.listId
    let idx=list.indexOf(auid)
    if(idx<list.length-1){
       let i=list[idx+1]
       that.setData({
         audioid:list[idx+1]
       })
      that.getAudio(i).then(
        res=>{
          that.playBack()
        }
      )
    } else {
      wx.showToast({
        title: '已经是最后一首了',
        icon:"none"
      })
    }
  },
  back:function(){
    let that = this
    let auid = that.data.audioid
    let list = that.data.listId
    let idx = list.indexOf(auid)
    if (idx > 0) {
      let i = list[idx - 1]
      that.setData({
        audioid: list[idx - 1]
      })
      that.getAudio(i).then(
        res => {
          that.playBack()
        }
      )
    }
    else{
      wx.showToast({
        title: '已经是第一首了',
        icon: "none"
      })
    }
  },
  Play:function(){
    let that = this
    if(backgroundAudioManager.paused==true){
      if(that.data.stPlay==true){
        that.playBack()
      }
      else{
    backgroundAudioManager.play()
    that.setData({
      canPlay: false,
      canSlider: false,
    })
      }
    }
    else{
      that.playBack()
    }
  },
  Pause: function () {
    let that = this
    backgroundAudioManager.pause()
    backgroundAudioManager.onPause(
      ()=>{
        that.setData({
          canPlay:true,
          canSlider:true,
        })
      }
    )
  },
  seek: function () {
    let that = this
    backgroundAudioManager.seek(backgroundAudioManager.currentTime + 10)
    
  },
  slider4change: function (e) {
    let that=this
    
    backgroundAudioManager.seek(parseInt(e.detail.value))
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that=this
    if (backgroundAudioManager.paused == true) {
      wx.getStorage({
        key: 'audioId',
        success: function(res) {
          if(res.data[2]==false||res.data[5]==false){
            console.log("777")
            that.setData({
              canPlay: true,
              canSlider: true,
              stPlay: true,
            })
          }
        },
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    let that = this
    wx.setStorage({
      key: 'audioId',
      data: [that.data.audio.id, that.data.canPlay, that.data.canSlider, that.data.end, that.data.audio.poster.path],
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let that = this
    wx.setStorage({
      key: 'audioId',
      data: [that.data.audio.id, that.data.canPlay, that.data.canSlider, that.data.end, that.data.audio.poster.path],
    })
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
  getToken(){
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
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let that=this
    let title=that.data.audio.title
    let recommend = that.data.recomId
    console.log(that.data.audioid)
    return {
      title: title,
      desc: '最具人气的小程序开发联盟!',
      path: '/pages/audioDetail/audioDetail?id=' + that.data.audioid+"&recommend="+recommend,
    }
  }
})