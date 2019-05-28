// pages/projectDetail/projectDetail.js
const myFirst = require('../../utils/myfirst');
const myfirst = new myFirst()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:"",
    curId:99,
    page:0,
    projectDetail:[],
    left:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    that.setData({
       title:options.title,
       curId:options.idx,
       key:options.key
    })
    if(that.data.curId!='99'){
      console.log(that.data.curId)
      that.setData({
        left: 40 * that.data.curId
      })
    }
    that.getToken()
    that.getProjectDetail(options.key).then(
      res=>{
         that.getKinds()
      }
    )
  },
  change:function(e){
    let that=this
    let idx=e.currentTarget.dataset.idx
    let key=e.currentTarget.dataset.name
    that.setData({
      curId:idx,
      projectDetail:[],
      key:key,
      page:0
    })
    that.getProjectDetail(key)
  },
  // 获取项目详情
  getProjectDetail: function (key) {
    let that = this
    let page=that.data.page
    let query = new wx.BaaS.Query()
    if(that.data.curId==99){
      query.compare('bigKind', '=', key)   
    }
    else{
      query.compare('kind', '=', key)
    }
    return new Promise(
      (resolve, reject) => {
        myfirst.getTableSelect(63531, 10, 10*page, 'create_at', '-created_at', query).then(
          res => {
            that.setData({
              projectDetail: that.data.projectDetail.concat(res.data.objects)
            })
            resolve()
          }
        )
      }
    )
  },
  goDetail:function(e){
    let that=this
    let name=e.currentTarget.dataset.name
    let id=e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../smprojectDetail/smprojectDetail?id='+id+"&name="+name,
    })
  },
  // 获取种类
  getKinds:function(){
     let that=this
     let query=new wx.BaaS.Query()
     let title=that.data.title
     query.compare('proName','=',title)
     return new Promise(
       (resolve,reject)=>{
         myfirst.getTableSelect(62878, 20, 0, 'create_at', '-created_at', query).then(
           res => {
             that.setData({
                kinds:res.data.objects[0].sm_project
             })
           })
           resolve()
       }
     )
  },
  getToken() {
    let that = this
    return new Promise(
      (resolve, reject) => {
        myfirst.getUserInfoByToken().then(
          res => {
            that.setData({
              recomId: res.data.id
            })
            if (res.data.is_authorized == false) {
              // if (res.data.jundge == false) {

              wx.redirectTo({
                url: '../../pages/login/login?recomId=' + that.data.recommend,
              })
            }
            resolve(res)
          }
        )
      }
    )
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that=this
    wx.stopPullDownRefresh();
    that.setData({
      page: 0,
    })
      setTimeout(
          function () {
            that.setData({
              projectDetail: [],
            })
            that.getProjectDetail(that.data.key);
          }, 500
        )

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that=this
    wx.stopPullDownRefresh();
    let page=that.data.page
    page++
    that.setData({
      page: page,
    })
    setTimeout(
      function () {
        that.getProjectDetail(that.data.key);
      }, 500
    )

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let that = this
    let title = that.data.title
    let recommend = that.data.recomId
    return {
      title: title,
      desc: '最具人气的小程序开发联盟!',
      path: '/pages/projectDetail/projectDetail?key=' + that.data.key + "&recommend=" + recommend + "&title=" + title+"&idx="+that.data.curId,
    }
  }
})