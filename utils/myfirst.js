class Common{
  constructor(){
    
  }
  getTable(tableId){
  return new Promise(
    (resolve, reject) => {
      let MyTableObject = new wx.BaaS.TableObject(tableId)
      MyTableObject.find().then(
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
getQueryTable(tableId,query){
  return new Promise(
    (resolve, reject) => {
      let MyTableObject = new wx.BaaS.TableObject(tableId)
     
      MyTableObject.setQuery(query).find().then(
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