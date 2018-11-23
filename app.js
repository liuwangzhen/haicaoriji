//app.js
App({
  onLaunch: function() {
    let that = this

    // 引入 BaaS SDK
    require('./utils/sdk-v1.9.1')


    let clientId = this.globalData.clientId

    wx.BaaS.init(clientId)
    let MyUser = new wx.BaaS.User()
    wx.BaaS.login(false).then(res => {
      that.globalData.userId = res.id
      MyUser.get(res.id).then(res => {
        // success
        that.globalData.userInfo = res.data
      }, err => {
        // err
      })
    }, err => {
      // 登录失败
    })
    wx.getSystemInfo({
      success: (res) => {
          this.globalData.height=res.statusBarHeight
      }
    })
  },
  
  globalData: {
    clientId: '2a34038c67c7b7868088', // 从 BaaS 后台获取 ClientID
     // 从 https://cloud.minapp.com/dashboard/ 管理后台的数据表中获取
    baseUrl: 'https://2a34038c67c7b7868088.xiaoapp.io',
    userId:"",
    userInfo:"",
    height:0,
  }
})
// App({
//   onLaunch: function () {
//     wx.BaaS = requirePlugin('sdkPlugin')
//     //让插件帮助完成登录、支付等功能
//     wx.BaaS.wxExtend(wx.login,
//       wx.getUserInfo,
//       wx.requestPayment)

//     let clientID = 'fb50a157808925b362ec'
//     wx.BaaS.init(clientID)
//   }
// })
