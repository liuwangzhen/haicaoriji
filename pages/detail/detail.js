// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    richTextID: "",
    list: "",
    id:"",
    nick:"",
    headimg:"",
    count:"",
    current:0,
    userid:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
   
    var id = options.id;
    let that = this;
    that.setData({
      id:id
    })
    that.getPic(id);

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  goUser:function(){
    var userid=this.data.userid;
    wx.navigateTo({
      url: '../userinfo/userinfo?id='+userid,
    })
  },
  getPic: function(id) {
    let that = this
    let tableID = 55960
    let recordID = id

    let Product = new wx.BaaS.TableObject(tableID)

    Product.get(recordID).then(res => {
      // success
     
      
      var datetime = new Date(res.data.updated_at * 1000);
     
      let id = res.data.created_by
      let MyUser = new wx.BaaS.User()
      that.setData({
        userid: res.data.created_by
      })

      MyUser.get(id).then(res => {
        
       that.setData({
         headimg:res.data.headimg,
         nick:res.data.nick,
       })
        
        
      }, err => {
        // err
      })
    
     
     
     
      
   
 
  
      var year = datetime.getFullYear();
      var month = datetime.getMonth() + 1;
      var hours = datetime.getHours();
      var minutes = datetime.getMinutes();
      if (hours <= 9) {
        hours = "0" + hours;
      }
      if (minutes <= 9) {
        minutes = "0" + minutes;
      }
      if (month <= 9) {
        month = "0" + month;
      }
      var date = datetime.getDate();
      if (date <= 9) {
        date = "0" + date;
      }
      var dateformat = year + "-" + month + "-" + date +" "+hours+":"+minutes;
      that.setData({
        list: res.data,
        date:dateformat,
        count: res.data.img.length
      })
      wx.getImageInfo({
        src: res.data.img[0],
        success: function(res) {
        
          that.setData({
            height: res.height*1.5,
            
           
          })
        }
      })

    }, err => {
      // err
    })
  },
  change:function(e){
   
    var that=this
    var i=e.detail.current
    that.setData({
      current:i,

    })
    wx.getImageInfo({
      src: that.data.list.img[i],
      success: function (res) {
       
        that.setData({
          height: res.height*1.5,


        })
      }
    })

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
  onShareAppMessage: function() {

  }
})