const app = getApp();
const Page = require('../../utils/ald-stat.js').Page;
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    height4: getApp().globalData.height,
  },
  onLoad: function (e) {
    var that = this;
   console.log(e)
   that.setData({
     id:e.id,
     recomId:e.recomId
   })

  },
  userInfoHandler(data) {
    let that=this
    let MyUser = new wx.BaaS.User()
    wx.BaaS.handleUserInfo(data).then(res => {
      let sex = res.gender
      let city = res.city
      let country = res.country
      let province = res.province
      let MyUser = new wx.BaaS.User()
      let currentUser = MyUser.getCurrentUserWithoutData()
      let nick = res.nickName
      let avatar = res.avatarUrl
      // let recomId=that.data.recomId
      // age 为自定义字段
      wx.BaaS.login(false).then(res => {
        MyUser.get(res.id).then(res => {
          // success
          if (res.data.recommend != null) {
            that.setData({
              recomId:res.data.recommend
            })
          }
          console.log(that.data.recomId)
          currentUser.set({
            'sex': sex,
            'country0': country,
            'province0': province,
            'city0': city,
            'collection': ['ssss2'],
            'nick': nick,
            'attention': [2],
            'jundge': true,
            'recommend':parseInt(that.data.recomId)
          }).update().then(res => {
            let avatar = res.data.avatar
            currentUser.set({
              'headimg': avatar,
            }).update().then(res => {
            }, err => { })
            let tableID = 56146
            let Product = new wx.BaaS.TableObject(tableID)
            let product = Product.create()

            // 设置方式一
            let apple = {
              fans: [2],
              nick: nick,
            }
            product.set(apple).save().then(res => {
              // success
              console.log(res)
            }, err => {
              //err 为 HError 对象
            })

          }, err => {
            // err
          })
          wx.reLaunch({
            url: '/pages/detail/detail?id=' + that.data.id + "&getshare=" + 1+"&recomId="+456,
          })
        },
          err => {
            // err
          })

      }, err => {
        // err
      })
      
      // res 包含用户完整信息，详见下方描述
    }, res => {
      
      let currentUser = MyUser.getCurrentUserWithoutData()
      wx.BaaS.login(false).then(res => {
        MyUser.get(res.id).then(res => {
        // success
        if(res.data.recommend==null){
        currentUser.set({
        'recommend':parseInt(that.data.recomId),
      }).update().then(res => {
       console.log(res)
      })}
        },
          err => {
            // err
          })
        
      }, err => {
        // err
      })
    })
  },

})