class Common{
  constructor(){
    
  }
  getTable(tableId,num1,num2,order){
  return new Promise(
    (resolve, reject) => {
      let MyTableObject = new wx.BaaS.TableObject(tableId)
      MyTableObject.orderBy(order).limit(num1).offset(num2).find().then(
        res => {
          resolve(res)
        },
        err => {
          reject(err)
        }
      )
    }
  )
}
getRecord(tableID,recordID){
  return new Promise(
    (resolve,reject)=>{
      let Product = new wx.BaaS.TableObject(tableID)
      Product.get(recordID).then(res => {
        // success
        resolve(res)
      }, err => {
        // err
        reject(err)
      })
    }
  )
}
shuffle(arr) {
  let i = arr.length,
    t, j;
  while (i) {
    j = Math.floor(Math.random() * i--);
    t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  }
}
renew(a){
  return new Promise(
    (resolve,reject)=>{
      let MyUser = new wx.BaaS.User()
      let currentUser = MyUser.getCurrentUserWithoutData()
      // a 为自定义字段
      currentUser.set(a).update().then(res => {
        // success
        resolve(res)
      }, err => {
        // err
        reject(err)
      })
    }
  )
}
  getUserInfoByToken(){
    return new Promise(
      (resolve,reject)=>{
        let MyUser = new wx.BaaS.User()
        wx.BaaS.login(false).then(res => {
          MyUser.get(res.id).then(res => {
            resolve(res)
          }, err => {
            // err
            rejecct(err)
          })
          // 登录成功
        }, err => {
          // 登录失败
        })
      }
    )
  }
getQueryTable(tableId,query,num1,num2,order){
  return new Promise(
    (resolve, reject) => {
      let MyTableObject = new wx.BaaS.TableObject(tableId)
     
      MyTableObject.setQuery(query).limit(num1).offset(num2).orderBy(order).find().then(
        res => {
          resolve(res)
        },
        err => {
          reject(err)
        }
      )
    }
  )
}

getRecord(tableID,recordID){
  return new Promise(
    (resolve,reject)=>{
      let Product = new wx.BaaS.TableObject(tableID)
      Product.get(recordID).then(res => {
        // success
        resolve(res)
      }, err => {
        // err
        reject(err)
      })
    }
  )
}


}
module.exports = Common;