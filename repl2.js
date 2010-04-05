var sys = require('sys'),
fs = require('fs'),
qs = require('querystring'),
url = require('url'),
buffered_cmd = '',
repl2 = exports,
scopedVar = /^\s*var\s*([_\w\$]+)(.*)$/m,
scopeFunc = /^\s*function\s*([_\w\$]+)/;

exports.scope = {};

repl2.readLine = function(_cmd) {
	var cmd = trimWhitespace(_cmd),
	parsedKeyword = parseREPLKeyword(cmd),
	output;

	if (parsedKeyword) {
		return parsedKeyword;
	}

	buffered_cmd += _cmd;
	buffered_cmd = convertToScope(buffered_cmd);

	try {
		with(exports.scope) {
			output = eval(buffered_cmd);
      output = sys.inspect(output); // otherwise foo = {} will notput {} properly
			if (output !== undefined) {
				exports.scope['_'] = output;
			}
		}
		buffered_cmd = '';
	} catch(e) {
		if (e instanceof SyntaxError) {
			output = '...';
		} else {
			output = e.stack;
			buffered_cmd = '';
		}
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

