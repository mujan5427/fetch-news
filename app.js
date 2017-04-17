var express = require('express')
var app = express()
var port = 8080;
var fetch_news = require('./modules/news.js');
var fetch_channel = require('./modules/channel.js');

var channel_type = {
  '117': '國際',
  '23083': '財經',
  '84984': '藝文',
  '118': '政治',
};

var channel_count = Object.keys(channel_type).length;

// 程式主體
//
// --------------------------------------------------


// 抓取指定 news_id 的所有內容
// fetch_news('251507');

// 指定 channel_type 去抓取固定頁數(3)的資料
for (var j = 1; j <= 3; j++) {
  fetch_channel(Object.keys(channel_type)[0], j);
}


app.listen(port, function () {
  console.log(`App listening on port ${port} !`)
})
