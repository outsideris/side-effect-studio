var util = require('util')
  , fs = require('fs')
  , qs = require('querystring')
  , url = require('url')
  , Mongolian = require('mongolian')
  , buffered_cmd = ''
  , repl2 = exports
  , scopedVar = /^\s*var\s*([_\w\$]+)(.*)$/m
  , scopeFunc = /^\s*function\s*([_\w\$]+)/
  , putsm = [];

var db = new Mongolian(process.env["MONGODB_HOST"] + ':' + process.env["MONGODB_PORT"], {
        log: {
            debug: function(message){ }
          , info:  function(message){ }
          , warn:  function(message){ console.log(message) }
          , error: function(message){ console.log(message) }
        }
      }).db('sideeffect_main');
db.auth(process.env["MONGODB_USER"], process.env["MONGODB_PASS"]);

var trynode = db.collection('trynode');

exports.scope = {};

repl2.readLine = function(_cmd, uid, res) {
	if (!exports.scope[uid]) {
		exports.scope[uid] = {};
	}

    var cmd = repl2.trimWhitespace(_cmd),
	parsedKeyword = repl2.parseREPLKeyword(cmd, uid),
	output = [],
	output_tmp,
	output_s;

	if (parsedKeyword) {
        res.send({
            response: ['|']   
	    });
	}

    var isUserCommand = repl2.userCommand(cmd, uid)
    if (isUserCommand) {
        var output = [];
        cmd = repl2.stripSemicolon(cmd);
        cmd = repl2.stripBrace(cmd); 

        trynode.find({cmd:cmd}).sort({order:1}).forEach(function(item) {
            output.push(item.contents);
        }, function(err) {
            res.send({
              response: output   
            });
        });
    } else {

	    buffered_cmd += _cmd;
	    buffered_cmd = repl2.convertToScope(buffered_cmd, uid);

	    try {
		    with(exports.scope[uid]) {
			    output = [];
			    output_tmp = eval(buffered_cmd);
			    output_s = util.inspect(output_tmp); // otherwise foo = {} will notput {} properly
			    if (output_tmp) {
				    output.push(output_s);
			    }
			    if (output_tmp !== undefined) {
				    exports.scope[uid]['_'] = output_s;
			    }
		    }
		    buffered_cmd = '';
	    } catch(e) {
	    	if (e instanceof SyntaxError) {
			    output.push('SyntaxError');
		    } else {
			    output.push("Error: " + e.stack.split("\n")[0]);
			    buffered_cmd = '';
		    }
	    }

    	if (putsm.length > 0) {
		    output = output.concat(putsm);
		    extra_output = ''
		    putsm = [];
	    }
        res.send({
           response: output   
	    });
    }
};

repl2.trimWhitespace = function(cmd) {
  if (cmd) {
 	  return cmd.replace(/^\s+/, '').replace(/\s+$/, '');
 	}
};

repl2.stripSemicolon = function(cmd) {
  if (cmd.charAt(cmd.length-1) === ';') {
    cmd = cmd.substring(0, cmd.length-1);
  }
  return cmd;
}

repl2.convertToScope = function(cmd, uid) {
	var matches;

	// Replaces: var foo = "bar";  with: exports.scope.foo = bar;
	matches = scopedVar.exec(cmd);
	if (matches && matches.length == 3) {
		return "exports.scope." + uid + '.' + matches[1] + matches[2];
	}

	// Replaces: function foo() {};  with: foo = function foo() {};
	matches = scopeFunc.exec(cmd);
	if (matches && matches.length == 2) {
		return matches[1] + " = " + cmd;
	}

	return cmd;
}

repl2.parseREPLKeyword = function(cmd, uid) {
	switch (cmd) {
  	case ".break":
  		buffered_cmd = '';
  		return true;
  	case ".clear":
  		buffered_cmd = '';
  		exports.scope[uid] = {};
  		return true;
	}
	return false;
}

repl2.userCommand = function(cmd) {
   cmd = repl2.stripSemicolon(cmd);
    switch (cmd) {
       case "whoami()":
          return true;
       case "contacts()":
          return true;
       case "projects()":
          return true;
       case "interest()":
          return true;
    }
    return false;
}

repl2.stripBrace = function(cmd) {
   return cmd.replace(/\(\)$/, "");
}

util.puts = function(msg) {
  putsm.push(msg);
}

util.p = function(msg) {
  putsm.push(msg);
}

util.print = function(msg) {
  putsm.push(msg);
}

