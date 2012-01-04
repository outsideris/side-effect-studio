var util = require('util'),
url = require('url'),
qs = require('querystring'),
express = require('express'),
gollum = require('../apps/gollum-connector'),
wiki = module.exports = express.createServer();

// Environment configration
wiki.configure(function() {
    wiki.use(express.methodOverride());
    wiki.use(express.bodyParser());
    wiki.use(express.static(__dirname.replace('/controllers', '') + '/public'));
});

wiki.configure('development', function() {
    wiki.use(express.errorHandler({ 
        dumpException: true, 
        showStack: true
    }));      
});

wiki.configure('pruduction', function() {
    wiki.use(express.errorHandler());      
});

wiki.configure('test', function() {
    wiki.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

wiki.set('views', __dirname.replace('/controllers', '') + '/views');

// WIKI Controller
wiki.post('/compare/*', function(req, res) {
  gollum.getContents(req.url + '/' + req.body.versions[0] + '...' + req.body.versions[1], res);
});

wiki.get('/edit/*', function(req, res) {
  res.send('', 404);
});

wiki.get('*', function(req, res) {
  gollum.getContents(req.url, res);
});
