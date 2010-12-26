var sys = require('sys'),
fs = require('fs'),
url = require('url'),
child_process = require('child_process'),
qs = require('querystring'),
express = require('express'),
repl2 = require('./repl/repl2'),
app = module.exports = express.createServer();

// Environment configration
app.configure(function() {
    app.use(express.methodOverride());
    app.use(express.bodyDecoder());
    app.use(app.router);
    app.use(express.staticProvider(__dirname + '/static'));
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

app.set('views', __dirname + '/views');

// Controller
app.get('/', function(req, res) {
    res.render('index.jade');      
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

if (!module.parent) {
    app.listen(3000);
}