// pages/addNote/addNote.js
import regeneratorRuntime from '../../utils/runtime'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arr1: [],
    arr2: [],
    arr3:[],
    addDetail: "",
    check: true,
    content: "",
    height4: getApp().globalData.height,
    focus1:true,
    focus2:false,
    focus3:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  previewImage: function(e) {

    let current = e.currentTarget.dataset.item
    let arr1 = this.data.arr1
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: arr1 // 需要预览的图片http链接列表
    })
  },
  addDetail() {
    var _this = this
    wx.chooseLocation({
      success(res) {
        _this.setData({
          addDetail: res.address,
        })
      }
    })
  },
  delete: function(e) {
    var that = this;
    let id = e.currentTarget.dataset.id;
    var arr1 = that.data.arr1.splice(id, 1);
    that.setData({
      arr1: that.data.arr1
    })
    if (that.data.arr1.length < 9) {
      that.setData({
        check: true
      })
    }
  },
  add: function() {
    var that = this;
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        that.setData({
          arr1: that.data.arr1.concat(res.tempFilePaths)
        })
        if (that.data.arr1.length >= 9) {
          that.data.arr1.splice(9, 9)
          that.setData({
            check: false,
            arr1: that.data.arr1
          })
        }
        // for (var i = 0; i < res.tempFilePaths.length; i++) {
        //   let MyFile = new wx.BaaS.File()
        //   let fileParams = { filePath: res.tempFilePaths[i] }
        //   let metaData = { categoryName: 'SDK' }
        //   MyFile.upload(fileParams, metaData).then(e => {
        //     that.setData({
        //       arr1: that.data.arr1.concat(e.data.path)
        //     })
        //     if (that.data.arr1.length>=9)
        //     {
        //        that.data.arr1.splice(9,9)
        //       that.setData({
        //         check: false,
        //         arr1:that.data.arr1
        //       })
        //     } 
        //   }, err => {
        //   })
        // }
      }
    })
  },
  content: function(e) {
    var that = this;
    var value = e.detail.value;
    // let str = value.split('\n').join('&hc')
    // value = value.replace(/\ /g, "");
    this.setData({
      content: value,
      focus1:true,
      focus2:false,
      focus3:false,
    })
  },
  submit: function() {
    let tableID = 55960
    let Product = new wx.BaaS.TableObject(tableID)
    let product = Product.create()
    let that = this
    setTimeout(
      function() {
        if (that.data.arr1 == '' || that.data.content == '') {
          wx.showToast({
            title: '请输入完整',
            icon: 'none',
            duration: 2000
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '确认发布',
            success: function(res) {
              if (res.confirm) {
                let arr1 = that.data.arr1
                let n=arr1.length
                let obj = {
                  idx: "",
                  src: ""
                }
                let list = new Array(n)
                let list0 = new Array
                for(let i = 0; i < arr1.length; i++){
                  let i2=arr1.length-1;
                  list[i]=obj;
                  let MyFile = new wx.BaaS.File()
                  let fileParams = {
                    filePath: arr1[i],
                  }
                  let metaData = {
                    categoryName: 'SDK'
                  }
                  MyFile.upload(fileParams, metaData).then(e => {
                      console.log(i)
                      list[i].src = e.data.path
                      list[i].idx = i;
                        that.setData({
                          arr3: that.data.arr3.concat(list[i]).sort(compare('idx'))
                        })
                        console.log(that.data.arr3)
                        if(that.data.arr3.length==arr1.length){
                         wait();
                        }
                        function compare(property) {
                          return function (a, b) {
                            var value1 = a[property];
                            var value2 = b[property];
                            return value1 - value2;
                          }
                        }  
            
                    },
                    err => {})
                  }
               function wait(){
                 console.log("wait")
                    let list5=new Array
                    let len2 = that.data.arr3.length
                    let arr4=new Array
                    let arr3=that.data.arr3
                    for (let k = 0; k < len2; k++) {
                      list5[k]=arr3[k].src
                      arr4.push(list5[k])
                      if(k==len2-1){
                        that.setData({
                          arr2:arr4
                        })
                      }
                  }
                 wait2();
                }
                function wait2(){
                  let arr2 = that.data.arr2
                  let content = that.data.content
                  let address = that.data.addDetail
                  let apple = {
                    img: arr2,
                    content: content,
                    address: address,
                  }
                  product.set(apple).save().then(res => {
                    console.log(res)
                    wx.showToast({
                      title: '提交成功..',
                      icon: 'success',
                      duration: 4000,
                      success: function (res) {
                        that.setData({
                          arr1: [],
                          addDetail: "",
                          check: true,
                          content: "",
                          arr2: [],
                          arr3:[],
                        })
                        wx.switchTab({
                          url: '../../pages/mine/mine',
                        })
                      }
                    })
                  })
                }
              } else if (res.cancel) {}
            }
          })
        }
      }, 200
    )
  },
  focusText:function(e){
    console.log(e.detail.height)
    let that=this
    that.setData({
      height2:e.detail.height
    })
  },
  focusChange:function(){
    let that=this
    that.setData({
      focus1:false,
      focus2:true,
      focus3:true,
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

  }
})