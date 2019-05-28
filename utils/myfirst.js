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
  getTableAndQuery(tableId, limit, page, order, select,query){
    return new Promise(
      (resolve,reject)=>{
        let Product = new wx.BaaS.TableObject(tableId)
        if (query == '' || query == undefined) {
          Product.limit(limit).offset(page * limit).select(select).orderBy(order).find().then(res => {
            // success
            resolve(res)
          }, err => {
            // err
            reject(err)
          })
        }
        else {
          Product.setQuery(query).limit(limit).offset(page * limit).select(select).orderBy(order).find().then(res => {
            // success
            resolve(res)
          }, err => {
            reject(err)
            // err
          })
        }
      }
    )
}
  getTableSeleNoQuery(tableId, num1, num2, order,sele){
    return new Promise(
      (resolve, reject) => {
        let MyTableObject = new wx.BaaS.TableObject(tableId)
        MyTableObject.orderBy(order).limit(num1).offset(num2).select(sele).find().then(
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
getTableSelect(tableId,num1,num2,order,sele,query){
  return new Promise(
    (resolve,reject)=>{
      let MyTableObject = new wx.BaaS.TableObject(tableId)
      MyTableObject.orderBy(order).setQuery(query).limit(num1).offset(num2).select(sele).find().then(
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
// gengxin
update(a,b,c){
  return new Promise(
    (resolve,reject)=>{
      let tableId = a
      let recordID = b  // 数据行 id
      let Product = new wx.BaaS.TableObject(tableId)
      let product = Product.getWithoutData(recordID)
      product.set(c)
      product.update().then(res => {
        // success
        resolve(res)
      }, err => {
        // err
        reject(err)
      })
    }
  )
}

// shangchaun
upload(path,name){
  return new Promise(
    (resolve,reject)=>{
  let MyFile = new wx.BaaS.File()
  let fileParams = { filePath: path }
  let metaData = { categoryName: name }
  // upload API 返回一个 Promise，1.8.0 后返回值增加了 onProgressUpdate 和 abort 方法
  let uploadTask = MyFile.upload(fileParams, metaData)
  // 文件成功上传的回调
  uploadTask.then(res => {
     resolve(res)
  })
    }
  )
}
}
module.exports = Common;