// 引入https模块，由于我们爬取的网站采用的是https协议
const https = require('https');
var express = require('express');
var app = express();
var fs = require('fs');

var opt = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25'
  }
}
const cheerio = require('cheerio');
var url = "https://v.douyin.com/6vVWFQ";

const req = https.request(url, opt, function (res) {
  var html = '';
  res.on("data", function (chunk) {
    html += chunk;
  });
  res.on("end", function () {
    var $ = cheerio.load(html)
    var $a = $('a').text()
    doSomeThing($a);
  });

});
req.on('error', (e) => {
  console.error(`请求遇到问题: ${e.message}`);
});
req.end();

function doSomeThing(url) {
  let post = https.request(url, opt, function (res) {
    var html = '';
    res.on("data", function (chunk) {
      html += chunk;
    });
    res.on("end", function () {
      var patt1 = new RegExp("video_id=([0-9a-z]{4,44})");
      var url2 = patt1.exec(html)[0];
      url2 = "https://aweme.snssdk.com/aweme/v1/play/?" + url2 + "&line=0"
      doSomeThing2(url2)
      
      
    });
  })
  post.on('error', (e) => {
    console.error(`请求遇到问题: ${e.message}`);
  });
  post.end();
}
function doSomeThing2(url) {
  let post = https.request(url, opt, function (res) {
    var html = '';
    res.on("data", function (chunk) {
      html += chunk;
    });
   
    res.on("end", function () {
      var patt1 = new RegExp("http://([A-Za-z0-9-./\?=]{4,244})");
      var url2 = patt1.exec(html)[0];
      fs.writeFile('input2.txt', url2, function (err) {
        if (err) {
          return console.error(err);
        }
      });
    });
  })
  post.on('error', (e) => {
    console.error(`请求遇到问题: ${e.message}`);
  });
  post.end();
}
app.get('/index.html', function (req, res) {
  res.sendFile(__dirname + "/" + "index.html");
})
var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)

})