var sys = require('sys'),
express = require('express'),
wiki = module.exports = express.createServer();

// Environment configration
wiki.configure(function() {
    wiki.use(express.bodyDecoder());
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

// WIKI Controller
wiki.get('/', function(req, res) {
  res.send('hello wiki');
});