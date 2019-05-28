//app.js
const App = require('./utils/ald-stat.js').App;
var startTime = Date.now();//启动时间

App({
  onLaunch: function() {
    let that = this
    
    // 引入 BaaS SDK 我已经使用的是v2.09了
    require('./utils/sdk-v2.09.js')
    wx.BaaS.init('2a34038c67c7b7868088')
    wx.BaaS.auth.loginWithWechat().then(res => {
      that.globalData.userInfo = res._attribute
          }, err => {
            // 登录失败
           console.log(err)
          })
   
    wx.getSystemInfo({
      success: (res) => {
          this.globalData.height=res.statusBarHeight
          this.globalData.model=res.model
      }
    })
    
    
   
  },
  // onShow: function (opt) {
  //  if(opt.shareTicket!=undefined){
  //    wx.getShareInfo({
  //      shareTicket: opt.shareTicket,
  //      success:function(res){
  //                 wx.checkSession({
  //             success: function () {
  //               console.log(res)
  //               wx.BaaS.wxDecryptData(res.encryptedData, res.iv, 'open-gid').then(decrytedData => {
  //                 console.log(decrytedData)
  //               }, err => {
  //                 console.log("shibai")
  //               })
  //             },
  //             fail: function () {
  //               wx.BaaS.logout()
  //               wx.BaaS.login()
  //             }
  //           })
  //      }
  //    })
  //  }
   
  // },

  
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

