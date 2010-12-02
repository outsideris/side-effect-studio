PORT = 8000;
HOST = null; //localhost

var sys = require('sys'),
fs = require('fs'),
url = require('url'),
http = require('http'),
util = require('./util'),
express = require('express'),
app = express.createServer();

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

app.set('views', __dirname + '/views');

app.get('/', function(req, res) {
    res.render('index');      
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
