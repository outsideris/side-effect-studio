var sys = require('sys'),
fs = require('fs'),
qs = require('querystring'),
url = require('url'),
util = exports;

util.getMap = [];

util.sessions = {};

util.createSession = function() {
	var session = {
		id: Math.floor(Math.random() * 999999999999).toString()
	};
	util.sessions[session.id] = session;
	return session;
};

util.get = function(path, handler) {
	util.getMap[path] = handler;
};

util.not_found = function(req, res) {
	var not_found_msg = 'Not Found';

	res.writeHead(404, {
		'Content-Type': 'text/plain',
		'Content-Length': not_found_msg.length
	});
	res.write(not_found_msg);
	res.close();
};

util.staticHandler = function(filename) {
	var body;

	function loadResponseData(callback) {
		fs.readFile(filename, function(err, data) {
			if (err) {
				sys.debug('Error loading file ' + filename);
			} else {
				sys.debug('loading file ' + filename);
				body = data;
			}
			callback();
		});
	}

	return function(req, res) {
		loadResponseData(function() {
			res.writeHead(200, {
				'Content-Type': 'text/html',
				'Content-Length': body.length
			});
			res.write(body);
			res.close();
		});
	};

};

util.get('/', util.staticHandler('index.html'));
util.get('/client.js', util.staticHandler('client.js'));
util.get('/style.css', util.staticHandler('style.css'));
util.get('/log.js', util.staticHandler('log.js'));

util.get('/version', function(req, res) {
	sys.exec('node --version', function(err, stdout, stderr) {
		if (err) throw err;
		res.simpleJSON(200, {
			nodejs_version: stdout
		});
	});
});

util.get('/cmd', function(req, res) {
	res.simpleJSON(200, {
		response: 'hello world'
	});
});

