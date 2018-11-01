
let getBooks = (uid, cb) => {
  let tableId = getApp().globalData.tableId,
    Books = new wx.BaaS.TableObject(tableId),
    query = new wx.BaaS.Query()

  query.compare('created_by', '=', uid)
  Books.setQuery(query).find()
    .then(res => cb(res))
    .catch(err => console.dir(err))
}

let addBook = (ctx, cb) => {

  let tableId = getApp().globalData.tableId,
    Books = new wx.BaaS.TableObject(tableId),
    Book = Books.create(),
    bookName = ctx.data.creatingBookName

  let data = {
    bookName,
  }

  Book.set(data)
    .save()
    .then(res => cb(res))
    .catch(err => console.dir(err))

}

let updateBook = (ctx, cb) => {
  let tableId = getApp().globalData.tableId,
    recordId = ctx.data.curRecordId,
    bookName = ctx.data.editingBookName

  let Books = new wx.BaaS.TableObject(tableId),
    Book = Books.getWithoutData(recordId)

  let data = {
    bookName
  }

  Book.set(data)
    .update()
    .then(res => cb(res))
    .catch(err => console.dir(err))
}

let deleteBook = (ctx, cb) => {
  let tableId = getApp().globalData.tableId,
    recordId = ctx.data.curRecordId

  let Books = new wx.BaaS.TableObject(tableId)

  Books.delete(recordId)
    .then(res => cb(res))
    .catch(err => console.dir(err))
}
let create=function(){
let tableID = '54506'
// 通过 `tableID` 实例化一个 `TableObject` 对象，操作该对象即相当于操作对应的数据表
let Product = new wx.BaaS.TableObject(tableID)
// 本地创建一条空记录
let product = Product.create() // product 为 TableRecord 实例

let apple = {
  name: 'apple',
  price: 1,
  desc: ['good'],
  amount: 0
}

// 为上面创建的空记录赋值，并保存到服务器，save() 方法返回一个 Promise 对象
product.set(apple).save().then(res => {
  console.log("0000")
  console.log(res)
})
  }
module.exports = {
  getBooks,
  addBook,
  updateBook,
  deleteBook,
}