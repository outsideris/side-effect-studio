PORT = 8000;
HOST = null; //localhost

var sys = require('sys'),
fs = require('fs'),
url = require('url'),
http = require('http'),
util = require('./util'),
child_process = require('child_process'),
qs = require('querystring'),
express = require('express'),
repl2 = require('./repl2'),
app = express.createServer();

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
}

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

app.listen(3000);

http.createServer(function(req, res) {
	var handler = util.getMap[url.parse(req.url).pathname] || util.not_found;

	res.simpleJSON = function(code, obj) {
		var body = JSON.stringify(obj);
		res.writeHead(code, {
			'Content-Type': 'text/json',
			'Content-Length': body.length
		});
		res.write(body);
		res.close();
	};

	handler(req, res);
}).listen(PORT, HOST);
