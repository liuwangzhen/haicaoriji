// pages/comments/comments.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  comments:[],
  input:true,
  input2:false,
  input3:false,
  focus:false,
    focus: false, height4: getApp().globalData.height,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
     let that=this
     let user=getApp().globalData.userInfo
     that.setData({
       id:e.id,
       user:user
     })
     that.getcomment();
     
  },
getcomment:function(){
    let that=this
    let id=that.data.id
    let query = new wx.BaaS.Query()
    query.compare("cid","=",id)
    let Product = new wx.BaaS.TableObject(56497)
    let list=new Array   
  Product.setQuery(query).orderBy(['-created_at']).limit(10).offset(0).expand('created_by').find().then(res => {
      let list0=res.data.objects  
      for(let i=0;i<res.data.objects.length;i++){
        list0[i].idx = i;     
        let query2 = new wx.BaaS.Query()
        let i2 = res.data.objects.length - 1
        query2.compare("cid", "=", list0[i].id)
        let Product2 = new wx.BaaS.TableObject(56584)
        Product2.setQuery(query2).expand('created_by').find().then(e => {
         list0[i].answers = e.data.objects  
         list0[i].created_at = that.getDate(list0[i].created_at)
         list.push(list0[i])
         if (i == i2){
           that.setData({
             comments: list.sort(compare('idx'))
           })
         }
          function compare(property) {
            return function (a, b) {
              var value1 = a[property];
              var value2 = b[property];
              return value1 - value2;
            }
          }
        })  
       
      }
 
    }, err => {
      // err
    })

  },
  send: function () {
    let that = this
    setTimeout(function(){
    let comment = that.data.commentVal
    let cid = that.data.id
    let tableID = 56497
    let Product = new wx.BaaS.TableObject(tableID)
    let product = Product.create()
    let apple = {
      comment: comment,
      cid: cid,
    }
    product.set(apple).save().then(res => {
      that.getcomment()
      that.setData({
        commentVal: "",
      })
      wx.showToast({
        title: '评论成功',
      })
    }, err => {
      //err 为 HError 对象
        })
    },100)

  },
  answer: function (e) {
    let that = this
    let coid = e.currentTarget.dataset.id
    that.setData({
      input2: true,
      input:false,
      focus2: true,
      coid: coid
    })
  },
  inputVal: function (e) {
    this.setData({
      commentVal: e.detail.value  
    });
  },
  inputVal3: function (e) {
    this.setData({
      commentVal: e.detail.value,
      input3:false,
      focus3:false,
      input:true,
      focus:true,
    });
  },
  focusInput:function(){
    this.setData({
      input3:true,
      focus3:true,
    })
  },
  focusInput3:function(e){
   this.setData({
     height2:e.detail.height,  
   })
  }, 
  focusInput2: function (e) {
    this.setData({
      height3: e.detail.height,
    })
  }, 
  sendanswer: function () {
    let that = this
    setTimeout(function(){
    let comment = that.data.commentVal2
    let cid = that.data.coid
    let tableID = 56584
    let Product = new wx.BaaS.TableObject(tableID)
    let product = Product.create()
    let apple = {
      answer: comment,
      cid: cid,
    }
    product.set(apple).save().then(res => {
      that.getcomment()
      that.setData({
        input2: false,
        input:true,
        commentVal2: "",
      })
    }, err => {

        })
    },100)
  },
  inputVal2: function (e) {
    this.setData({
      commentVal2: e.detail.value,
      input2:false,
      input:true,
    });
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
  getDate: function (d) {
    var st = d
    var datetime = new Date(st * 1000);
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
    var dateformat = year + "-" + month + "-" + date + " " + hours + ":" + minutes;
    return dateformat
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
    return {
      title: "荔枝医美",
      desc: '最具人气的小程序',
      path: '/pages/indexo/indexo'
    }
  }
})