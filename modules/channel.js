var request = require('request')
var cheerio = require('cheerio')
var htmlDncode = require('js-htmlencode').htmlDecode
var connection_db = require('../helpers/connection_db.js');


var fetch_channel = function(channel_id) {

  // 發送 cUrl 抓取資料後，儲存至 Database
  //
  // --------------------------------------------------

  request(
    { method: 'GET'
    , uri: `http://www.storm.mg/article/${news_id}`
    }
    , function (error, response, body) {

      if (response.statusCode == 200) {
        console.log('status : ' + response.statusCode)

        var $ = cheerio.load(body);

        var article_title = $('h1#article_title').text();
        article_title = article_title.trim();

        var article_author = $('.author_date > .gtm-articleAuthor').text();
        var article_date = $('.author_date > .date').text().slice(0, 17);
        var article_main_image = $('.imgs.mainPic > img').attr('src');
        var article_main_image_figcation = $('.imgs.mainPic > div > p').text();
        var article_description = $('article > p:nth-of-type(1)').text();


        // 每篇文章的圖片數量
        var article_img_count = $('.type-image').length;

        // 將爬來的文章中的 figure area 替換成我設計的版型
        for (var i = 1; i <= article_img_count; i++) {

          var figure_area = `<figure><img src="${$(`.dnd-atom-wrapper:nth-of-type(1)  img`).attr('src')}"><figcaption>${$(`.dnd-atom-wrapper:nth-of-type(1) .meta`).text()}</figcaption></figure>`

          $(`.type-image:nth-of-type(1)`).replaceWith(figure_area);

        }

        // 文章內容處理

        $('.article-wrapper > article > p').removeAttr('aid');
        $('.article-wrapper > article > h2').removeAttr('class')

        var article_content = $('.article-wrapper > article').html();
        article_content = article_content.split('<div class="ad_article_block">')[0].trim();

        // console.log(article_author);

        // 寫入資料到 Database
        var sql = `INSERT INTO news (title, author, publish_date, main_image, main_image_figcation, description, content) VALUES ('${article_title}', '${article_author}', '${article_date}', '${article_main_image}', '${article_main_image_figcation}', '${article_description}', '${htmlDncode(article_content)}')`;

        connection_db(sql);

      } else {

        console.log('error: '+ response.statusCode)

      }
    }
  )

}

module.exports = fetch_channel;
