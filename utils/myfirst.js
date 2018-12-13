class Common{
  constructor(){
    
  }
  getTable(tableId){
  return new Promise(
    (resolve, reject) => {
      let that = this
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
}
module.exports = Common;