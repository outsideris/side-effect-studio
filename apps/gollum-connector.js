var sys = require('sys'),
    request = require('request'),
    jsdom = require('jsdom'),
    gollum = module.exports;

gollum.getContents = function(url, res) {

  request({uri:'http://localhost:4567'+url}, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var window = jsdom.jsdom(body).createWindow();
      jsdom.jQueryify(window, 'http://code.jquery.com/jquery-1.4.2.min.js', function (window, jquery) {
        var gollumContents = window.jQuery('.site').html();
        res.render('gollum.jade', {
          locals: {
             title:'wiki',
             contents:gollumContents
          }
        });
      });
    }
  });
}