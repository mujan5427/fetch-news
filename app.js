var express = require('express')
var request = require('request')
var cheerio = require('cheerio')
var htmlDncode = require('js-htmlencode').htmlDecode
var app = express()
var port = 8080;
var connection_db = require('./helpers/connection_db.js');


request(
    { method: 'GET'
    , uri: 'http://www.storm.mg/article/250561'
    }
    , function (error, response, body) {

      if (response.statusCode == 200) {
        console.log('status : ' + response.statusCode)

        var $ = cheerio.load(body);

        var article_title = $('h1#article_title').text();
        article_title = article_title.trim();

        var article_author = $('a.gtm-articleAuthor').text();
        var article_date = $('span.date').text().slice(0, 17);
        var article_main_image = $('.imgs.mainPic > img').attr('src');
        var article_main_image_figcation = $('.imgs.mainPic > div > p').text();
        var article_description = $('article > p:nth-of-type(1)').text();



        // 每篇文章的圖片數量
        var article_img_count = $('.type-image').length;

        for (var i = 1; i <= article_img_count; i++) {

          var figure_area = `<figure><img src="${$(`.dnd-atom-wrapper:nth-of-type(1) img`).attr('src')}"><figcaption>${$(`.dnd-atom-wrapper:nth-of-type(1) .meta`).text()}</figcaption></figure>`

          $(`.type-image:nth-of-type(1)`).replaceWith(figure_area);

        }

        // 文章內容處理

        $('.article-wrapper > article > p').removeAttr('aid');
        $('.article-wrapper > article > h2').removeAttr('class')

        var article_content = $('.article-wrapper > article').html();
        article_content = article_content.split('<div class="ad_article_block">')[0].trim();

        // console.log(htmlDncode(article_content));


        var sql = `insert into news (news_title, author, news_contetn) VALUES ('第三則新聞', '何宗軒', '${htmlDncode(article_content)}')`;

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
