var util = require('util'),
    url = require('url'),
    jsdom = require('jsdom'),
    gollum = module.exports;

gollum.getContents = function(pageUrl, res) {
  jsdom.env('http://'+process.env["GOLLUM_HOST"] +':'+ process.env["GOLLUM_PORT"]+pageUrl,
    function (error, window) {
      var submitElem = window.document.getElementById('gollum-editor-submit');
      if (submitElem && submitElem.value === 'Save') {
         res.send('', 404);
         return;
      }
        
      var title = ' - ' + window.document.getElementById('head').getElementsByTagName('h1')[0].innerHTML;
      
      var newBtn = window.document.getElementById('minibutton-new-page');
      if (newBtn) {
        newBtn.parentNode.removeChild(newBtn);
      }
      var editBtns = window.document.getElementsByClassName('action-edit-page');
      for (var i = 0; editBtns.length > 0; ) {
        editBtns.item(i).parentNode.removeChild(editBtns.item(i));
      }
      var search = window.document.getElementById('search-query');
      if (search) {
        search.parentNode.removeChild(search);
      }
      var revertBtns = window.document.getElementsByClassName('gollum-revert-button');
      for (var i = 0; revertBtns.length > 0; ) {
        revertBtns.item(i).parentNode.removeChild(revertBtns.item(i));
      }

      var gollumContents = window.document.getElementsByTagName('body').item(0).innerHTML;
 
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
};
