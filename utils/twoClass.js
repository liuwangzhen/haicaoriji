class Common{
  // 普通对象的继承 传入父对象
 object(o) {

  　　　　function F() { }
         
  　　　　F.prototype = o;

  　　　　return new F();

　　}
//var 子 = object(父); 子.属性=。。
// 浅拷贝 只是拷贝基本类型的数据
extendCopy(p) {

　　　　var c = {};

　　　　for (var i in p) {
  　　　　　　c[i] = p[i];
　　　　}

　　　　c.uber = p;

　　　　return c;
　　}
// 所谓"深拷贝"，就是能够实现真正意义上的数组和对象的拷贝。它的实现并不难，只要递归调用"浅拷贝"就行了。
 deepCopy(p, c) {

  　　　　var c = c || {};

  　　　　for (var i in p) {

    　　　　　　if (typeof p[i] === 'object') {

      　　　　　　　　c[i] = (p[i].constructor === Array) ? [] : {};

      　　　　　　　　deepCopy(p[i], c[i]);

    　　　　　　} else {

      　　　　　　　　　c[i] = p[i];

    　　　　　　}
  　　　　}

  　　　　return c;
　　}
//cshiyong var Doctor = deepCopy(Chinese);
}
module.exports=Common;