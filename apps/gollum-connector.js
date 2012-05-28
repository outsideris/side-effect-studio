var util = require('util'),
    url = require('url'),
    jsdom = require('jsdom'),
    gollum = module.exports;

gollum.getContents = function(pageUrl, res) {
  jsdom.env('http://'+process.env["GOLLUM_HOST"] +':'+ process.env["GOLLUM_PORT"]+pageUrl, function (error, window) {
    jsdom.jQueryify(window, 'http://code.jquery.com/jquery-1.7.2.min.js', function () {
      if (window.$('#gollum-editor-submit').val() === 'Save') {
         res.send('', 404);
         return;
      }
        
      var siteDom = window.$('body');
      var head = window.$('#head');
      var title = ' - ' + head.find('h1').first().text();

      var gollumContents = siteDom
                              .find('#minibutton-new-page').remove().end()
                              .find('.action-edit-page').remove().end()
                              .find('#search-query').val('').end()
                              .find('.gollum-revert-button').remove().end()
                              .html();
      
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
  });
};
