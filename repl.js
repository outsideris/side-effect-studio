var repl = exports;

var fs = require('fs'),
qs = require('querystring'),
url = require('url'),
util = exports,
buffered_cmd = '';

exports.readLine = function(_cmd) {
	var cmd = trimWhitespace(_cmd),
	output;

	buffered_cmd += _cmd;

	try {
		output = eval(buffered_cmd);
		buffered_cmd = '';
	} catch(e) {
		if (! (e instanceof SyntaxError)) {
			throw e;
		}
		output = '...';
	}

	return output;
};

/**
 * Trims Whitespace from a line.
 * 
 * @param {String} cmd The string to trim the whitespace from
 * @returns {String} The trimmed string 
 */
var trimWhitespace = function(cmd) {
	var matches = trimmer.exec(cmd);
	if (matches && matches.length == 2) {
		return matches[1];
	}
};

var trimmer = /^\s*(.+)\s*$/m;

