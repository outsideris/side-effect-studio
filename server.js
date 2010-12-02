PORT = 8000;
HOST = null; //localhost

var sys = require('sys'),
fs = require('fs'),
url = require('url'),
http = require('http'),
util = require('./util');
app = require('express').createServer();

app.get('/', function(req, res) {
    res.send('hello world');      
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
