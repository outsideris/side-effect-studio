var sys = require('sys'),
child_process = require('child_process'),
fs = require('fs'),
qs = require('querystring'),
url = require('url'),
util = exports,
repl2 = require('./repl2'),
buffered_cmd = '';

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
	child_process.exec('node --version', function(err, stdout, stderr) {
		if (err) throw err;
		res.simpleJSON(200, {
			nodejs_version: stdout
		});
	});
});

util.get('/cmd', function(req, res) {
	var cmd = qs.parse(url.parse(req.url).query).cmd;
	res.simpleJSON(200, {
    response: repl2.readLine(cmd)
	});
});
