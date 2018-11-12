// pages/attention/attention.js
const list3 = new Array;
Page({

      /**
       * 页面的初始数据
       */
      data: {
        list: [],
        attentions: [],
        getshare: 0, height4: getApp().globalData.height,
      },

      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: function(options) {
        let that=this
        this.setData({
          aid: options.id
        })
        
        this.getUserInfoByToken();
    
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

      /**
       * 生命周期函数--监听页面初次渲染完成
       */
      onReady: function() {

      },
      getUserInfo: function() {
        let that = this
        let MyUser = new wx.BaaS.User()
        let id = that.data.aid

        MyUser.get(id).then(res => {

          that.setData({
            attention2: res.data.attention,
            nick:res.data.nick
          })
          wx.setNavigationBarTitle({
            title: res.data.nick //页面标题为路由参数
          })
          that.getList();
        }, err => {
          // err
        })

      },
  userinfo: function (e) {
    console.log(e)
    let id = e.currentTarget.dataset.id
    if (id == getApp().globalData.userId) {
      wx.switchTab({
        url: '../mine/mine',
      })
    }
    else {
      wx.navigateTo({
        url: '../userinfo/userinfo?id=' + id,
      })
    }
  },
      getList: function() {

        let that = this
        let MyUser = new wx.BaaS.User()
        let attention2 = that.data.attention2
        let query = new wx.BaaS.Query()
        let list2 = new Array;
        let list = new Array;
        let attentions = that.data.attentions;
        query.in('id', attention2)
        MyUser.setQuery(query).find().then(res => {
          
          let list0 = res.data.objects;
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
      getUserInfoByToken: function() {
        let that = this
        let MyUser = new wx.BaaS.User()

        wx.BaaS.login(false).then(res => {

          MyUser.get(res.id).then(res => {
          
            that.setData({
              attentions: res.data.attention,
              apid: res.data.id,

            })

          }, err => {
            // err
          })
          that.getUserInfo();
        }, err => {
          // 登录失败
        })
      },
      cancel: function(e) {
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
              
              that.update(fans,rid);
    
            })
          })
          },
          attented:function(e){
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
          update:function(fans,rid){
        
            let Product = new wx.BaaS.TableObject(56146)
            let product = Product.getWithoutData(rid)
            product.set('fans', fans)
            product.update().then(e3 => {
             
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
            let that = this
            let id = that.data.aid

            return {
              title: '荔枝医美',
              desc: '最具人气的小程序开发联盟!',
              // path: '/pages/attention/attention?id=' + id+"&getshare="+1,
              path: '/pages/indexo/indexo',
            }
          }
        })