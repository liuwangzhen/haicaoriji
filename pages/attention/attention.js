// pages/attention/attention.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    this.setData({
      aid:options.id
    })
    this.getUserInfo();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  getUserInfo: function () {
    let that = this
    let MyUser = new wx.BaaS.User()
    let id = that.data.aid
    
    MyUser.get(id).then(res => {
   
      that.setData({
        attention2: res.data.attention,
      })
      wx.setNavigationBarTitle({
        title: res.data.nick //页面标题为路由参数
      })
      that.getList();
    }, err => {
      // err
    })
   
  },
  getList:function(){
    let that=this
    let MyUser = new wx.BaaS.User()
    let attention2=that.data.attention2
    console.log(attention2)
    // 查询 nickname 中包含 like 的用户
    let query = new wx.BaaS.Query()
    let list = new Array
    query.in('id', attention2)
    MyUser.setQuery(query).find().then(res => {
      // success
     
     let list0=res.data.objects
      for(let i=0;i<res.data.objects.length;i++){
        let Product = new wx.BaaS.TableObject(55960)
        let query2 = new wx.BaaS.Query()
        query2.compare('created_by','=',list0[i].id)
        Product.setQuery(query2).count().then(num => {
       
          list0[i].num=num
          list.push(list0[i])
        }, err => {
          // err
        })
        let Product2 = new wx.BaaS.TableObject(56146)
        let query3 = new wx.BaaS.Query()
        query3.compare('created_by', '=', list0[i].id)
        Product2.setQuery(query3).find().then(res => {
          console.log(res)
          console.log(res.data.objects[0].fans.length-1)
          list0[i].fans = res.data.objects[0].fans.length-1
          list.push(list0[i])
        }, err => {
          // err
        })
      }
      that.setData({
        list:list
      })
    }, err => {
      // err
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
  onShareAppMessage: function () {
  
  }
})