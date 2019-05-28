// 引入https模块，由于我们爬取的网站采用的是https协议
const https = require('https');
var fs = require('fs');
var opt = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25'
  }
}
const cheerio = require('cheerio');

// 这里以爬取拉钩网为例

var url = "https://v.douyin.com/6vVWFQ";
// var url ="https://www.iesdouyin.com/share/video/6690732903376096523/?region=CN&amp;mid=6690512477630827275&amp;u_code=14h5dlkcm&amp;titleType=title&amp;timestamp=1557820733&amp;utm_campaign=client_share&amp;app=aweme&amp;utm_medium=ios&amp;tt_from=copy&amp;utm_source=copy"
// 使用https模块中的get方法，获取指定url中的网页源代码
const req = https.request(url, opt, function (res) {
  var html = '';
  // 每当我们从指定的url中得到数据的时候,就会触发res的data事件,事件中的chunk是每次得到的数据,data事件会触发多次,因为一个网页的源代码并不是一次性就可以下完的
  res.on("data", function (chunk) {
    html += chunk;
  });
  // 当网页的源代码下载完成后, 就会触发end事件

  res.on("end", function () {
    var $ = cheerio.load(html)
    var $a = $('a').text()

    //这里我们对下载的源代码进行一些处理
    doSomeThing($a);
  });

});
req.on('error', (e) => {
  console.error(`请求遇到问题: ${e.message}`);
});
req.end();

function doSomeThing(url){
  let post=https.request(url,opt,function(res){
    var html = '';
    // 每当我们从指定的url中得到数据的时候,就会触发res的data事件,事件中的chunk是每次得到的数据,data事件会触发多次,因为一个网页的源代码并不是一次性就可以下完的
    res.on("data", function (chunk) {
      html += chunk;
    });
    res.on("end", function () {
      var $ = cheerio.load(html)
      var $a = $('a').text()
      fs.writeFile('input.txt', $a, function (err) {
        if (err) {
          return console.error(err);
        }
      });
      //这里我们对下载的源代码进行一些处理
    });
  })
  post.on('error', (e) => {
    console.error(`请求遇到问题: ${e.message}`);
  });
  post.end();
}