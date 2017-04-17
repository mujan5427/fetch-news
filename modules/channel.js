var request = require('request')
var cheerio = require('cheerio')
var htmlDncode = require('js-htmlencode').htmlDecode
var connection_db = require('../helpers/connection_db.js');

var channel_type = {
  '117': '國際',
  '23083': '財經',
  '84984': '藝文',
  '118': '政治',
};


var fetch_channel = function(channel_id, channel_page) {

  // 發送 cUrl 抓取資料後，儲存至 Database
  //
  // --------------------------------------------------

  request(
    { method: 'GET'
    , uri: `http://www.storm.mg/category/${channel_id}/${channel_page}`
    }
    , function (error, response, body) {

      if (response.statusCode == 200) {
        console.log('status : ' + response.statusCode)

        var $ = cheerio.load(body);

        // 計算指定 channel_page 的新聞筆數
        var news_count_per_page = $('#load > li').length;


        // 按照筆數，逐筆抓取資料並寫入至 Database
        for (var i = 1; i <= news_count_per_page; i++) {

          var news_id = $(`#load > li:nth-of-type(${i}) .main_image > a.gtm-article-footerNews`).attr('href');
          news_id = news_id.replace('/article/', '');


          // 寫入資料到 Database
          var sql = `INSERT INTO news (news_id, channel_type) VALUES ('${news_id}', '${channel_type[channel_id]}')`;

          connection_db(sql);

          // 指定 channel_page 的資料寫入完成時，顯示: OK
          if (i === news_count_per_page) {
            console.log(`${channel_type[channel_id]} : page ${channel_page} is OK !`);
          }
        }

      } else {

        console.log('error: '+ response.statusCode)

      }
    }
  )

}

module.exports = fetch_channel;
