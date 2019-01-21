//app.js
const App = require('./utils/ald-stat.js').App;
var startTime = Date.now();//启动时间

App({
  onLaunch: function() {
    let that = this

    // 引入 BaaS SDK
    require('./utils/sdk-v1.15.0.js')
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
          this.globalData.model=res.model
      }
    })
    
   
  },
  onShow: function (opt) {
   if(opt.shareTicket!=undefined){
     wx.getShareInfo({
       shareTicket: opt.shareTicket,
       success:function(res){
                  wx.checkSession({
              success: function () {
                console.log(res)
                wx.BaaS.wxDecryptData(res.encryptedData, res.iv, 'open-gid').then(decrytedData => {
                  console.log(decrytedData)
                }, err => {
                  console.log("shibai")
                })
              },
              fail: function () {
                wx.BaaS.logout()
                wx.BaaS.login()
              }
            })
       }
     })
   }
   
  },

  
  globalData: {
    clientId: '2a34038c67c7b7868088', // 从 BaaS 后台获取 ClientID
     // 从 https://cloud.minapp.com/dashboard/ 管理后台的数据表中获取
    baseUrl: 'https://2a34038c67c7b7868088.xiaoapp.io',
    userId:"",
    userInfo:"",
    height:0,
    model:""
  }
})

