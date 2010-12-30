var sys = require('sys'),
    request = require('request'),
    jsdom = require('jsdom'),
    gollum = module.exports;

gollum.getGollumContents = function(url) {

  request({uri:'http://localhost:4567'}, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      //sys.puts(body);
      var window = jsdom.jsdom(body).createWindow();
      jsdom.jQueryify(window, 'http://cachedcommons.org/cache/jquery/1.4.2/javascripts/jquery-min.js', function (window, jquery) {
        sys.puts(window.jQuery('.admin small').html());
        return "test";
      });
    }
  })
}