var express = require('express')
var app = express()
var port = 8080;
var fetch_news = require('./modules/news.js');

// 抓取新聞
fetch_news('251507');

app.listen(port, function () {
  console.log(`App listening on port ${port} !`)
})
