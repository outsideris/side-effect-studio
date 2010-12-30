var sys = require('sys'),
url = require('url'),
qs = require('querystring'),
express = require('express'),
gollum = require('../apps/gollum-connector'),
wiki = module.exports = express.createServer();

// Environment configration
wiki.configure(function() {
    wiki.use(express.bodyDecoder());
    wiki.use(express.staticProvider(__dirname.replace('/controllers', '') + '/static'));
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
wiki.get('*', function(req, res) {
  gollum.getContents(req.url, res);
});