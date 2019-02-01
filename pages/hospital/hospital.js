// pages/hospital/hospital.js 61848
const myFirst = require('../../utils/myfirst');
const myfirst = new myFirst()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height4: getApp().globalData.height,
    list:[],
    projectDetail:[],
    page:0,
    isHospital:true,
    curId:0,
    BigPoster:[],
    tableId: 61848,
    idx:0,
    counselorId:0,
    title: [{ id: 61848, name: "项目", src: "../../images/ren.png" }, { id: 1, name: "药品", src: "../../images/yaowan.png" }, { id: 2, name: "材料", src: "../../images/cailiao.png" }, { id: 3, name: "仪器", src: "../../images/yiqi.png" },],
    proTwo:[],
    serves: [{ id: 0, name: "活动", path: "../../images/active.png" }, { id: 1, name: "医院", path: "../../images/hospital.png" },
     { id: 2, name: "百科", path: "../../images/ency.png" }, 
     { id: 3, name: "咨询师", path: "../../images/counselor.png" }, { id: 4, name: "查价格", path: "../../images/intent.png" },],
    serveId:0,
    // 意向表
    cdata: [{
      id: 9,
      title: '玻尿酸'
    }, {
      id: 9,
      title: '肉毒素'
    }, {
      id: 9,
      title: '眼部整形'
    },
    {
      id: 9,
      title: '鼻部整形'
    }, {
      id: 9,
      title: '胸部整形'
    }, {
      id: 9,
      title: '医学美肤'
    },
    {
      id: 9,
      title: '面部轮廓'
    },
    {
      id: 9,
      title: '吸脂瘦身'
    },
    ],
    valueName:"",
    queryProject:"",
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that=this
    that.getToken()
    that.getBigPoster()
    that.getActivies().then(
      res => {
        that.getPosters();
      }
    )
  },
  getBigPoster:function(){
    let that=this
    return new Promise(
      (resolve,reject)=>{
        myfirst.getTable(62121, 10, 0, 'created_at').then(
          res=>{
            that.setData({
              BigPoster:res.data.objects
            })
          }
        )
      }
    )
  },
  aChange:function(e){
    let that=this
    let isHospital=e.currentTarget.dataset.ex
    console.log(isHospital)
    that.setData({
      isHospital:isHospital
    })
  },
  
  getToken() {
    let that = this
    return new Promise(
      (resolve, reject) => {
        myfirst.getUserInfoByToken().then(
          res => {
            that.setData({
              recomId: res.data.id,
              phone: res.data.phone
            })
            resolve(res)
          }
        )
      }
    )
  },
  getHospital: function(){
    let that = this
    let page=that.data.page
    return new Promise(
      (resolve,reject)=>{
        myfirst.getTableSeleNoQuery(59863, 10, page*10, '-score', ['name','headimg','id','address','score']).then(
          (res)=>{
            if(res.data.objects==""){
              wx.showToast({
                title: '亲，已经到底了',
                icon:"none",
              })
            }
            that.setData({
              list:that.data.list.concat(res.data.objects),
            })
            resolve()
          }
        )
      }
    )
  },
  
  getActivies: function () {
    return new Promise(
      (resolve, reject) => {
        let that = this
        let query = new wx.BaaS.Query()
        query.compare('isHaveActive','=',true)
        myfirst.getTableSelect(59863, 20, 0, '-updated_at', ['name', 'headimg', 'activity', 'public', 'id'], query).then(
          res => {
            that.setData({
              activies: res.data.objects
            })
            resolve()
          }
        )
      }
    )
  },
  getPosters: function () {
    return new Promise(
      (resolve, reject) => {
        let that = this
        let list = new Array
        let activies = that.data.activies
        for (let i = 0; i < activies.length; i++) {
          let poster = activies[i].activity
          for (let k = 0; k < poster.length; k++) {
            poster[k].name = activies[i].name
            poster[k].id = activies[i].id
            poster[k].public = activies[i].public
            poster[k].headimg = activies[i].headimg
            list.push(poster[k])
          }
        }
        that.setData({
          list: list
        })
        resolve()
      }
    )
  },

  preview: function (e) {
    let that = this
    let current = e.currentTarget.dataset.path
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: [current] // 需要预览的图片http链接列表
    })
  },
  getCounselor: function () {
    let that = this
    return new Promise(
      (resolve, rejecct) => {
        myfirst.getTable(60959, 30, 0, 'order').then(
          res => {
            that.setData({
              list: res.data.objects
            })
            resolve(res)
          }
        )
      }
    )
  },
  intervalChange: function (e) {
    let index = e.detail.current
    let that = this
    that.setData({
      counselorId: index
    })
  },
  goCounselor: function (e) {
    let that = this
    let name = e.currentTarget.dataset.name
    let recommend = that.data.recommend
    if (recommend != undefined) {
      wx.navigateTo({
        url: '../chose/chose?name=' + name + '&recommend=' + recommend,
      })
    } else {
      wx.navigateTo({
        url: '../chose/chose?name=' + name,
      })
    }
  },
  serveChange:function(e){
    let that=this
    let tag=e.currentTarget.dataset.tag
    that.setData({
      serveId:tag,
      list:[],
      page:0,
      counselorId:0,
      projectDetail:[],
    })
    let idx=that.data.curId
    switch (tag){
      case 0:
        that.getActivies().then(
          res=>{
            that.getPosters();
          }
        )
        break;
      case 1:
        that.getHospital();
        break;
      case 2:
        switch (idx) {
          case 0:
            that.getProject().then(
              res => {
                that.getProjectDetail()
              }
            )
            break;
          case 1:
            // that.getMedicines();
            break;
          case 2:
            // that.getMaterial();
            break;
          case 3:
             
            break;
          // default:
          //   n 与 case 1 和 case 2 不同时执行的代码
        }
        break;
      case 3:
        that.getCounselor()
      break;
      case 4:
      break;
      // default:
      //   n 与 case 1 和 case 2 不同时执行的代码
    }
  },

  // 意向表
  inputName:function(e){
    let that = this
    that.setData({
      valueName: e.detail.value
    })
  },
  inputProject: function (e) {
    let that = this
    that.setData({
      queryProject: e.detail.value
    })
  },
  getPhoneNumber(e) {
    let that = this
    let valueName = that.data.valueName
    let queryProject = that.data.queryProject
    let encryptedData = e.detail.encryptedData
    let iv = e.detail.iv
    wx.checkSession({
      success: function (res) {
        console.log("处于登录态");
        wx.BaaS.wxDecryptData(encryptedData, iv, 'phone-number').then(decrytedData => {
          let a = {
            'phone': decrytedData.phoneNumber,
            realname: valueName,
            queryProject: queryProject,
            isQuery: true
          }
          let b = {
            isQuery: false
          }
           myfirst.renew(a).then(
             res=>{
              myfirst.renew(b).then(
                res => {
                  wx.showToast({
                    title: '提交成功',
                    icon: "success",
                    duration: 200,
                    success: function () {
                      wx.showModal({
                        title: '提示',
                        content: '感谢提交',
                        showCancel: false,
                        success: function () {
                          that.setData({
                            valueName: "",
                            queryProject: "",
                            phone:"15882397196"
                          })
                        },
                      })
                    }
                  })
                }
              )
             })
        }, err => {
          // 失败的原因有可能是以下几种：用户未登录或 session_key 过期，微信解密插件未开启，提交的解密信息有误
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '提交失败，请重试',
          icon: "none",
        })
        console.log("需要重新登录");
        wx.BaaS.logout()
        wx.BaaS.login()
      }
    })
  },
 
  submit: function (e) {
    console.log(e)
    let formID = e.detail.formId
    wx.BaaS.wxReportTicket(formID)
  },
  upload: function () {
    let that = this
    let valueName = that.data.valueName
    let queryProject = that.data.queryProject
    let a = {
      realname: valueName,
      queryProject:queryProject,
      isQuery: true
    }
    let b = {
      isQuery: false
    }
    if(valueName==""||queryProject==""){
      wx.showToast({
        title: '请填写完整',
        icon:"none"
      })
    }
    else{
    wx.showModal({
      title: '提示',
      content: '是否确认提交',
      success: function (res) {
        if (res.confirm) {
          myfirst.renew(a).then(
          res=>{
              myfirst.renew(b).then(
                res => {
                  wx.showToast({
                    title: '提交成功',
                    icon: "success",
                    duration: 200,
                    success: function () {
                      wx.showModal({
                        title: '提示',
                        content: '感谢提交',
                        showCancel: false,
                        success: function () {
                          that.setData({
                            valueName:"",
                            queryProject:"",
                          })
                        },
                      })
                    }
                  })
                }
              )
        })
        } else if (res.cancel){}
      }
    })
    }
  },
  
  // 百科项目
  pickPro: function (e) {
    let that = this
    let idx = e.currentTarget.dataset.idx
    that.setData({
      curId: idx,
      projectDetail: [],
      page:0,
    })
    switch (idx){
      case 0:
        that.getProject().then(
          res=>{
            that.getProjectDetail()
          }
        )
        break;
      case 1:
        // that.getMedicines();
        break;
      case 2:
        // that.getMaterial();
        break;
      case 3:
        
        break;
      // default:
      //   n 与 case 1 和 case 2 不同时执行的代码
    }
  },
  getProject:function(){
    let that=this
    let query = new wx.BaaS.Query()
    query.isNotNull('hot')
    return new Promise(
      (resolve,reject)=>{
        myfirst.getTableSelect(61848, 10, 0, 'create_at', ['id','proImage','proName'], query).then(
          res=>{
            that.setData({
              proTwo:res.data.objects
            })
            resolve()
          }
        )
      }
    )
  },
  getProjectDetail:function(){
    let that=this
    let page=that.data.page
    let query=new wx.BaaS.Query()
    query.compare('proNumber','=',1)
    return new Promise(
      (resolve,reject)=>{
        myfirst.getTableSelect(62878, 10, page*10, 'create_at', ['id', 'sm_project', 'proName'], query).then(
          res=>{
            that.setData({
              projectDetail:that.data.projectDetail.concat(res.data.objects)
            })
          }
        )
      }
    )
  },
  goProjectDetail:function(e){
    let that=this
    let key=e.currentTarget.dataset.key
    let title=e.currentTarget.dataset.title
    let idx=e.currentTarget.dataset.idx
    wx.navigateTo({
      url: '../projectDetail/projectDetail?key='+key+"&title="+title+"&idx="+idx,
    })
   
  },
  alert:function(){
     wx.showToast({
       title: '即将上线，敬请期待',
       icon:"none"
     })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    
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
    let that = this
    wx.stopPullDownRefresh();
    let serveId = that.data.serveId
    let page = that.data.page
    that.setData({
      page: 0,
    })
    switch (serveId) {
      case 0:
        break;
      case 1:
        setTimeout(
          function () {
            that.setData({
              list:[],
            })
            that.getHospital();
          }, 500
        )
        break;
        case 2:
        setTimeout(
          function () {
            that.setData({
              projectDetail: [],
            })
            that.getProjectDetail();
          }, 500
        )
    }
    wx.showToast({
      title: '正在刷新',
      duration:300,
    })
    // setTimeout(
    //   function () {
    //     that.getHospital();
    //   }, 500
    // )
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let that=this
    wx.stopPullDownRefresh();
    let serveId=that.data.serveId
    let page=that.data.page
    page++
    that.setData({
      page: page
    })
    switch (serveId) {
      case 0:
        break;
      case 1:
        setTimeout(
          function () {
            that.getHospital();
          }, 500
        )
        break;
      case 2:
        setTimeout(
          function () {
            that.getProjectDetail();
          }, 500
        )
        break;
    }
  },
  goCounselorDetail:function(e){
    let that=this
     let id=e.currentTarget.dataset.id
     console.log(id)
     wx.navigateTo({
       url: '../counselorDetail/counselorDetail?id='+id,
     })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    let that = this
    let recommend = that.data.recomId
    return {
      title: '海草日记',
      desc: '最具人气的小程序开发联盟!',
      path: '/pages/indexo/indexo?recommend=' + recommend,
    }
  }
})