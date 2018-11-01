const app = getApp();
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function() {
    var that = this;
    // 查看是否授权
    // wx.getSetting({
    //   success: function (res) {
    //     if (res.authSetting['scope.userInfo']) {
    //       wx.getUserInfo({
    //         success: function (res) {
    //           //从数据库获取用户信息
    //          console.log(res)
    //           //用户已经授权过
    //           wx.switchTab({
    //             url: '/pages/indexo/indexo'
    //           })
    //         }
    //       });
    // }
    //   }
    // })

  },
  userInfoHandler(data) {
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
        'collection':['ssss2'],
        'nick': nick,
      }).update().then(res => {
        console.log(res)
       
        let avatar=res.data.avatar
        currentUser.set({
          'headimg':avatar
        }).update().then(res => {
          console.log(res)
        },err=>{})
      }, err => {
        // err
      })
      wx.switchTab({
        url: '/pages/indexo/indexo'
      })
      // res 包含用户完整信息，详见下方描述
    }, res => {
      // **res 有两种情况**：用户拒绝授权，res 包含基本用户信息：id、openid、unionid；其他类型的错误，如网络断开、请求超时等，将返回 Error 对象（详情见下方注解）

    })
  },




  //获取用户信息接口


})