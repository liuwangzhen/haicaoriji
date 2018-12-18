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