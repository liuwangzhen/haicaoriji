// pages/fans/fans.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
   fans:[],
   id:"",
   getshare:0,
    height4: getApp().globalData.height,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   let that=this
    that.setData({
      id: options.id
    })
   
    that.getUserInfoByToken();

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
  getUserInfoByToken: function () {
    let that = this
    let MyUser = new wx.BaaS.User()
    wx.BaaS.login(false).then(res => {
      MyUser.get(res.id).then(res => {
        that.setData({
          attentions: res.data.attention,
          apid: res.data.id,
        })
        that.getUserInfo();
      }, err => {
        // err
      })
      
    }, err => {
      // 登录失败
    })
  },
  getUserInfo: function () {
    let that = this
    let query = new wx.BaaS.Query()
    let id=parseInt(that.data.id)
    console.log(that.data.id)
    query.compare('created_by', '=', id)
    let Product = new wx.BaaS.TableObject(56146)
    Product.setQuery(query).find().then(res => {
      // success
      console.log(res.data.objects[0].fans)
      that.setData({
        fans:res.data.objects[0].fans
      })
      that.getList();
    }, err => {
      // err
    })
   
      wx.setNavigationBarTitle({
        title: "粉丝" //页面标题为路由参数
      })
     
  },
  getList: function () {
    let that = this
    let attentions=that.data.attentions
    let fans=that.data.fans
    console.log(fans)
    let MyUser = new wx.BaaS.User()
    let query = new wx.BaaS.Query()
    query.in('id', fans)    
    MyUser.setQuery(query).find().then(res => {
      let list2 = new Array;
      let list = new Array;
      let list0=res.data.objects;
      for (let i = 0; i < res.data.objects.length; i++) {
        if (attentions.indexOf(res.data.objects[i].id) > -1) {
          list0[i].attent = 1
        } else {
          list0[i].attent = 0
        }
        let Product = new wx.BaaS.TableObject(55960)
        let query2 = new wx.BaaS.Query()
        query2.compare('created_by', '=', list0[i].id)
        Product.setQuery(query2).count().then(num => {

          list0[i].num = num;

          let Product2 = new wx.BaaS.TableObject(56146)
          let query3 = new wx.BaaS.Query()
          query3.compare('created_by', '=', list0[i].id)
          Product2.setQuery(query3).find().then(e => {
            let fans = e.data.objects[0].fans.length - 1;
            list0[i].fan = fans;
            list2.push(list0[i]);
            that.setData({
              list: list2,
            })
          }, err => {
            // err
          })

        }, err => {
          // err
        })
      }
    
    }, err => {
      // err
    })
   
   
  },
  cancel: function (e) {
    let that = this
    let id = e.currentTarget.dataset.id
    let index = e.currentTarget.dataset.index
    let attentions = that.data.attentions
    let idx = attentions.indexOf(id)
    attentions.splice(idx, 1)
    let list = that.data.list
    list[index].attent = 0
    that.setData({
      list: list
    })
    let MyUser = new wx.BaaS.User()
    let currentUser = MyUser.getCurrentUserWithoutData()
    currentUser.set('attention', attentions).update().then(res => {

      let Product = new wx.BaaS.TableObject(56146)
      let product = Product.getWithoutData(id)
      let query = new wx.BaaS.Query()
      query.compare("created_by", '=', id)
      Product.setQuery(query).find().then(e2 => {
        console.log(e2)
        let fans = e2.data.objects[0].fans
        let idx2 = fans.indexOf(that.data.apid)
        let rid = e2.data.objects[0].id

        fans.splice(idx2, 1)

        that.update(fans, rid);

      })
    })
  },
  attented: function (e) {
    let that = this
    let id = e.currentTarget.dataset.id
    let index = e.currentTarget.dataset.index
    let attentions = that.data.attentions.concat(id)
    let list = that.data.list
    list[index].attent = 1
    that.setData({
      list: list
    })
    let MyUser = new wx.BaaS.User()
    let currentUser = MyUser.getCurrentUserWithoutData()
    currentUser.set('attention', attentions).update().then(res => {
      let Product = new wx.BaaS.TableObject(56146)
      let product = Product.getWithoutData(id)
      let query = new wx.BaaS.Query()
      query.compare("created_by", '=', id)
      Product.setQuery(query).find().then(e2 => {

        let fans = e2.data.objects[0].fans.concat(that.data.apid)
        let rid = e2.data.objects[0].id

        that.update(fans, rid);
      })
    })
  },
  update: function (fans, rid) {

    let Product = new wx.BaaS.TableObject(56146)
    let product = Product.getWithoutData(rid)
    product.set('fans', fans)
    product.update().then(e3 => {

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
    let that = this
    let id = that.data.id
    return {
      title: '荔枝医美',
      desc: '最具人气的小程序开发联盟!',
      // path: '/pages/fans/fans?id=' +id+"&getshare="+1,
      path: '/pages/indexo/indexo',
    }
  }
})