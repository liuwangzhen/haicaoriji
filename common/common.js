
function collect(e) {
  
  let that = this
  let id = e.currentTarget.dataset.id
  let idx = e.currentTarget.dataset.index
  let collection = that.data.collection.concat(id)
  let MyUser = new wx.BaaS.User()
  let currentUser = MyUser.getCurrentUserWithoutData()
  let list = that.data.list
  let obj = list[idx]

  currentUser.set('collection', collection).update().then(res => {
    obj.collect = 1;
    obj.collection = parseInt(obj.collection) + 1;
    let collection = obj.collection
    list.splice(idx, 1, obj)
    that.setData({
      list: list
    })
    that.getUserInfoByToken()
    that.updatacollect(id, collection)
    wx.showToast({
      title: '收藏成功',
      icon: 'success',
      duration: 2000
    })

  }, err => {
    // err
  })
}
function updatacollect(id, collection) {
  let tableID = 55960
  let recordID = id

  let Product = new wx.BaaS.TableObject(tableID)
  let product = Product.getWithoutData(recordID)

  product.set('collection', collection)
  product.update().then(res => {
    // success

  }, err => {
    // err
  })
}
function nocollect(e){
  let that = this
  let id = e.currentTarget.dataset.id
  let idx = e.currentTarget.dataset.index
  let collection = that.data.collection
  let index = collection.indexOf(id)
  let list = that.data.list
  let obj = list[idx]
  collection.splice(index, 1);
  let MyUser = new wx.BaaS.User()
  let currentUser = MyUser.getCurrentUserWithoutData()
  currentUser.set('collection', collection).update().then(res => {
    // success
    obj.collect = 0;
    obj.collection = parseInt(obj.collection) - 1;
    let collection = obj.collection
    list.splice(idx, 1, obj)
    that.setData({
      list: list
    })
    that.getUserInfoByToken()
    that.updatacollect(id, collection)
    wx.showToast({
      title: '取消成功',
      icon: 'success',
      duration: 2000

    })
  }, err => {
    // err
  })
}
function getList() {
  
  let tableID = 55960
  let that = this
  let Product = new wx.BaaS.TableObject(tableID)
  let list = new Array;
  console.log(this.data.collection)
  Product.orderBy('-created_at').expand('created_by').limit(10).offset(0).find().then(res => {
    // success
    let list0 = res.data.objects
    for (var i = 0; i < res.data.objects.length; i++) {
      
      let collection = that.data.collection
      
      if (collection.indexOf(list0[i].id) > -1) {
        console.log("3232")
        list0[i].collect = 1;
        
        list0[i].content = that.LimitNumbersadf(list0[i].content);
        list.push(list0[i]);
        
      } else {
        console.log("32332")
        list0[i].collect = 0;
        list0[i].content = that.LimitNumbersadf(list0[i].content);
        list.push(list0[i]);
      }
      

    }

    console.log(list)
    that.setData({
      list: list,
      page: 0
    })

  }, err => {
    // err
  })
}
function LimitNumbersadf(txt) {

  var str = txt;
  str = str.substr(0, 25);
  str += '...'
  return str;
}

 function getList2 (){
  let tableID = 55960
  let that = this
  let Product = new wx.BaaS.TableObject(tableID)
  let list = new Array;
  let page = that.data.page
  page++;

  Product.orderBy('-created_at').expand('created_by').limit(10).offset(page * 10).find().then(res => {
    // success

    if (res.data.objects == "") {
      wx.showToast({
        title: '没有更多数据了',
      })
    }
    else {
      let list0 = res.data.objects
      for (var i = 0; i < res.data.objects.length; i++) {
        let collection = that.data.collection
        if (collection.indexOf(list0[i].id) > -1) {
          list0[i].collect = 1;
          list0[i].content = that.LimitNumbersadf(list0[i].content);
          list.push(list0[i]);
        } else {
          list0[i].collect = 0;
          list0[i].content = that.LimitNumbersadf(list0[i].content);
          list.push(list0[i]);
        }
      }
      that.setData({
        list: that.data.list.concat(list),
        page: page
      })
    }

  }, err => {
    // err
  })
}


module.exports= {
  collect: collect,
  updatacollect: updatacollect,
  getList: getList,
  getList2: getList2,


}
