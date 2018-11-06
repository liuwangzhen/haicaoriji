const app = getApp();
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function (e) {
    var that = this;
    console.log(e)
    that.setData({
      id: e.id
    })

  },
  userInfoHandler(data) {
    let that = this
    wx.BaaS.handleUserInfo(data).then(res => {

      let sex = res.gender
      let city = res.city
      let country = res.country
      let province = res.province
      let MyUser = new wx.BaaS.User()
      let currentUser = MyUser.getCurrentUserWithoutData()
      let nick = res.nickName
      let avatar = res.avatarUrl

      // age 为自定义字段
      currentUser.set({
        'sex': sex,
        'country0': country,
        'province0': province,
        'city0': city,
        'collection': ['ssss2'],
        'nick': nick,
        'attention': [2]
      }).update().then(res => {

        that.setData({
          id:res.data.id
        })
        let avatar = res.data.avatar
        currentUser.set({
          'headimg': avatar
        }).update().then(res => {

        }, err => { })
        let tableID = 56146
        let Product = new wx.BaaS.TableObject(tableID)
        let product = Product.create()

        // 设置方式一
        let apple = {
          fans: [2]
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
      wx.redirectTo({
        url: '/pages/userinfo/userinfo?id=' + id + "&getshare=" + 1,
      })
      // res 包含用户完整信息，详见下方描述
    }, res => {


    })
  },

})