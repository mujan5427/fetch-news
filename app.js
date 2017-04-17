var express = require('express')
var request = require('request')
var cheerio = require('cheerio')
var htmlDncode = require('js-htmlencode').htmlDecode
var app = express()
var port = 8080;
var connection_db = require('./helpers/connection_db.js');


request(
    { method: 'GET'
    , uri: 'http://www.storm.mg/article/249327'
    }
    , function (error, response, body) {

      if (response.statusCode == 200) {
        console.log('status : ' + response.statusCode)

        var article_start = body.split('<article>');
        var article_end = article_start[1].split('</article>');
        var article = article_end[0].split('<div class="ad_article_block">')[0];

        var $ = cheerio.load(article)



        // 每篇文章的圖片數量
        var article_img_count = $('.type-image').length;

        for (var i = 1; i <= article_img_count; i++) {

          var figure_area = `<figure><img src="${$(`.dnd-atom-wrapper:nth-of-type(1) img`).attr('src')}"><figcaption>${$(`.dnd-atom-wrapper:nth-of-type(1) .meta`).text()}</figcaption></figure>`

          console.log(i);

          $(`.type-image:nth-of-type(1)`).replaceWith(figure_area);

        }


        $('p').removeAttr('aid');
        $('h2').removeAttr('class')

        console.log(htmlDncode($.html()));


        var sql = `insert into news (news_title, author, news_contetn) VALUES ('第三則新聞', '何宗軒', '${htmlDncode($.html())}')`;

        connection_db(sql);


      } else {

        console.log('error: '+ response.statusCode)
        // console.log(body)

      }
    }
)



// app.get("/", function(req, res) {})


// 想要執行的 Sql statement
// var sql = 'insert into news (news_title, author, news_contetn) VALUES ("第二則新聞", "何宗軒", "我是新聞文章")';

//   connection_db(sql);

//   res.end('資料庫寫入完成')

// ---------------------------------------------


app.listen(port, function () {
  console.log(`App listening on port ${port} !`)
})
