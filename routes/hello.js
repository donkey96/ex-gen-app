var express = require('express');
var router = express.Router();

var http = require('https');
var parseString = require('xml2js').parseString;

router.get('/', (req, res, next) => {
  var opt = {
    host: 'news.google.com',
    port: 443,
    path: '/rss/topics/CAAqIQgKIhtDQkFTRGdvSUwyMHZNRE5mTTJRU0FtcGhLQUFQAQ?hl=ja&gl=JP&ceid=JP:ja'
  };
  http.get(opt, (res2) => {
    var body = '';
    res2.on('data', (data) => {
      body += data;
    });
    res2.on('end', () => {
      parseString(body.trim(), (err, result) => {
        var data = {
          title: 'Hello!',
          content: result.rss.channel[0].item
        };
        res.render('hello', data);
      })
    })
  });
});

module.exports = router;