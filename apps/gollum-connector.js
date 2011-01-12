var sys = require('sys'),
    url = require('url'),
    request = require('request'),
    jsdom = require('jsdom'),
    gollum = module.exports;

gollum.getContents = function(pageUrl, res) {
  request({uri:'http://localhost:4567'+pageUrl}, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var window = jsdom.jsdom(body).createWindow();

      jsdom.jQueryify(window, 'http://code.jquery.com/jquery-1.4.2.min.js', function (window, jquery) {
        var regex = /(\<a href=\"\/\"\>Home\<\/a\>)\s+\|/g;
        if (window.$('div.write').html()) {
           res.send('', 404);
           return;
        }
        
        var title = ' - ' + window.$('.site').find('h1').first().text();

        var gollumContents = window.$('.site')
                                .find('a[href=/edit'+ pageUrl + ']').remove().end()
                                .find('a[href=/edit/Home]').remove().end()
                                .html();
        gollumContents = gollumContents.replace(regex, '$1')
        gollumContents = gollumContents.replace(/&amp;rarr;/g, '&rarr;');
        
        var pathName = url.parse(pageUrl).pathname;
        var useDisqus = true;
        var regexHistory = /\/history\//i;
        var regexCompare = /\/compare\//i;
        if (pathName === '/search' || regexHistory.test(pathName) || regexCompare.test(pathName)) {
          title = '';
          useDisqus = false;
        }
        
        res.render('gollum.jade', {
          locals: {
             title:'wiki' + title,
             customStyles: '<link rel="stylesheet" href="/stylesheets/gollum.css">',
             customScript: '',
             contents:gollumContents,
             uid: 'wiki' + pathName,
             useDisqus: useDisqus
          }
        });
      });
    }
  });
};
