var sys = require('sys'),
fs = require('fs'),
qs = require('querystring'),
url = require('url'),
buffered_cmd = '',
repl2 = exports,
scopedVar = /^\s*var\s*([_\w\$]+)(.*)$/m,
scopeFunc = /^\s*function\s*([_\w\$]+)/,
putsm = [];

exports.scope = {};

repl2.readLine = function(_cmd) {
	var cmd = trimWhitespace(_cmd),
	parsedKeyword = parseREPLKeyword(cmd),
	output = [],
	output_tmp,
	output_s;

	if (parsedKeyword) {
		return parsedKeyword;
	}

	buffered_cmd += _cmd;
	buffered_cmd = convertToScope(buffered_cmd);

	try {
		with(exports.scope) {
			output = [];
			output_tmp = eval(buffered_cmd);
			output_s = sys.inspect(output_tmp); // otherwise foo = {} will notput {} properly
			if (output_tmp) {
				output.push(output_s);
			}
			if (output_tmp !== undefined) {
				exports.scope['_'] = output_s;
			}
		}
		buffered_cmd = '';
	} catch(e) {
		if (e instanceof SyntaxError) {
			output.push('...');
		} else {
			output.push(e.stack);
			buffered_cmd = '';
		}
	}

	if (putsm.length > 0) {
		output = output.concat(putsm);
		extra_output = ''
		putsm = [];
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

/**
 * Converts commands that use var and function <name>() to use the
 * local exports.scope when evaled. This provides a local scope
 * on the REPL.
 * 
 * @param {String} cmd The cmd to convert
 * @returns {String} The converted command
 */
function convertToScope(cmd) {
	var matches;

	// Replaces: var foo = "bar";  with: exports.scope.foo = bar;
	matches = scopedVar.exec(cmd);
	if (matches && matches.length == 3) {
		return "exports.scope." + matches[1] + matches[2];
	}

	// Replaces: function foo() {};  with: foo = function foo() {};
	matches = scopeFunc.exec(buffered_cmd);
	if (matches && matches.length == 2) {
		return matches[1] + " = " + buffered_cmd;
	}

	return cmd;
}

/**
 * Used to parse and execute the Node REPL commands.
 * 
 * @param {cmd} cmd The command entered to check
 * @returns {Boolean} If true it means don't continue parsing the command 
 */
function parseREPLKeyword(cmd) {
	switch (cmd) {
	case ".break":
		buffered_cmd = '';
		return '';
	case ".clear":
		buffered_cmd = '';
		exports.scope = {};
		return "Clearing Scope...";
	}
	return false;
}

sys.puts("Server at http://" + HOST + ':' + PORT.toString() + '/');

sys.puts = function(msg) {
	putsm.push(msg);
}

sys.p = function(msg) {
	putsm.push(msg);
}

sys.print = function(msg) {
	putsm.push(msg);
}
