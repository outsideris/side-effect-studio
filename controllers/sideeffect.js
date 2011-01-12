var sys = require('sys'),
url = require('url'),
child_process = require('child_process'),
qs = require('querystring'),
express = require('express'),
repl2 = require('../apps/repl2'),
app = module.exports = express.createServer();

// Environment configration
app.configure(function() {
    app.use(express.methodOverride());
    app.use(express.bodyDecoder());
    app.use(app.router);
    app.use(express.staticProvider(__dirname.replace('/controllers', '') + '/public'));
});

app.configure('development', function() {
    app.use(express.errorHandler({ 
        dumpException: true, 
        showStack: true
    }));      
});

app.configure('pruduction', function() {
    app.use(express.errorHandler());      
});

app.configure('test', function() {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.set('views', __dirname.replace('/controllers', '') + '/views');

// REPL App Controller
app.get('/', function(req, res) {
    res.render('index.jade', {
      locals: { 
        title:'node REPL',
        customStyles: '',
        customScript: '<script src="/javascripts/log.js"></script><script src="/javascripts/command_history.js"></script><script src="/javascripts/app.js"></script>',
        uid: 'repl-' + url.parse(req.url).pathname,
        useDisqus: true
      }
    });      
});

app.get('/version', function(req, res) {
  child_process.exec('node --version', function(err, stdout, stderr) {
    if (err) throw err;
    res.send({nodejs_version: stdout});
  });
});

app.get('/cmd', function(req, res) {
  var param = qs.parse(url.parse(req.url).query),
  cmd = param.cmd,
  uid = param.uid;
  repl2.readLine(cmd, 'nodejs' + uid, res)
});