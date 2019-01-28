// pages/smprojectDetail/smprojectDetail.js
const myFirst = require('../../utils/myfirst');
const myfirst = new myFirst()
Page({

  /**
   * 页面的初始数据
   */
  data: {
   title:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     let that=this
     that.getDetail(options.id)
     that.setData({
       title:options.name,
       id:options.id
     })
     that.getToken()
  },
  getDetail:function(recordID){
    let that=this
     return new Promise(
       (resolve,reject)=>{
         myfirst.getRecord(63531, recordID).then(
           res=>{
             console.log(res.data)
             let people=res.data.people.replace(/[\r\n]/g, "");
             people = people.replace(/\ +/g, "")
             people = people.split("；")
             let taboo = res.data.taboo.replace(/[\r\n]/g, "");
             taboo = taboo.replace(/\ +/g, "")
             taboo = taboo.split("；")
             let advantage = res.data.advantage.replace(/[\r\n]/g, "");
             advantage = advantage.replace(/\ +/g, "")
             advantage = advantage.split("；")
             let defect = res.data.defect.replace(/[\r\n]/g, "");
             defect = defect.replace(/\ +/g, "")
             defect = defect.split("；")
             let before = res.data.before.substring(4)
             let after = res.data.after.substring(4)
             that.setData({
               project:res.data,
               people:people,
               taboo:taboo,
               advantage: advantage,
               defect:defect,
               before:before,
               after:after,
             })
           }
         )
       }
     )
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let that = this
    let title = that.data.title
    let recommend = that.data.recomId
    return {
      title: title,
      desc: '最具人气的小程序开发联盟!',
      path: '/pages/smprojectDetail/smprojectDetail?id=' + that.data.id + "&recommend=" + recommend+"&name="+title,
    }
  }
})