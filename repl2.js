var sys = require('sys'),
fs = require('fs'),
qs = require('querystring'),
url = require('url'),
mongodb = require('mongodb'),
buffered_cmd = '',
repl2 = exports,
Db = mongodb.Db,
Server = mongodb.Server,
trimmer = /^\s*(.+)\s*$/m,
scopedVar = /^\s*var\s*([_\w\$]+)(.*)$/m,
scopeFunc = /^\s*function\s*([_\w\$]+)/,
putsm = [];

exports.scope = {};

repl2.readLine = function(_cmd, uid, res) {
    sys.debug("start readLine");
	if (!exports.scope[uid]) {
		exports.scope[uid] = {};
	}

    var cmd = trimWhitespace(_cmd),
	parsedKeyword = parseREPLKeyword(cmd, uid),
	output = [],
	output_tmp,
	output_s;

	if (parsedKeyword) {
        sys.debug("is paredKeyword");
        res.simpleJSON(200, {
            response: ['|']   
	    });
	}

    var isUserCommand = userCommand(cmd, uid)
    if (isUserCommand) {
        var output = [];
        cmd = stripBrace(cmd); 
        sys.debug("user command: " + cmd);

        var db = new Db('sideeffect_main', new Server(process.env["MONGODB_HOST"], process.env["MONGODB_PORT"], {}));
        db.open(function(err, db) {
            db.collection("trynode", function(err, collection) {
               collection.find({"cmd":cmd}, {"sort":"order"}, function(err, cursor) {
                  sys.debug("before each");
                  cursor.each(function(err, item) {
                     if (item != null) {
                         output.push(item.contents); 
                         sys.debug("contents: " + sys.inspect(item.contents));
                     } else {
                         sys.debug("end");
                         res.simpleJSON(200, {
                            response: output   
                         });
                     }
                  });
                  db.close();
              });   
           });        
        });
    } else {

	    buffered_cmd += _cmd;
	    buffered_cmd = convertToScope(buffered_cmd, uid);

	    try {
		    with(exports.scope[uid]) {
			    output = [];
                //sys.puts(buffered_cmd);
			    output_tmp = eval(buffered_cmd);
			    output_s = sys.inspect(output_tmp); // otherwise foo = {} will notput {} properly
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
        res.simpleJSON(200, {
           response: output   
	    });
    }
    sys.debug("end of readLine");
};

var trimWhitespace = function(cmd) {
	var matches = trimmer.exec(cmd);
	if (matches && matches.length == 2) {
		return matches[1];
	}
};

function convertToScope(cmd, uid) {
	var matches, tmp;

	// Replaces: var foo = "bar";  with: exports.scope.foo = bar;
	matches = scopedVar.exec(cmd);
	if (matches && matches.length == 3) {
		tmp = "exports.scope." + uid + '.' + matches[1] + matches[2];
		return tmp;
	}

	// Replaces: function foo() {};  with: foo = function foo() {};
	matches = scopeFunc.exec(buffered_cmd);
	if (matches && matches.length == 2) {
		return matches[1] + " = " + buffered_cmd;
	}

	return cmd;
}

function parseREPLKeyword(cmd, uid) {
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

var userCommand = function(cmd) {
    switch (cmd) {
       case "whoami()":
          return true;
       case "contacts()":
          return true;
       case "projects()":
          return true;
       case "skills()":
          return true;
    }
    return false;
}

var stripBrace = function(cmd) {
   return cmd.replace(/\(\)$/, "");
}
//sys.puts("Server at http://" + HOST + ':' + PORT.toString() + '/');

sys.puts = function(msg) {
  putsm.push(msg);
}

sys.p = function(msg) {
  putsm.push(msg);
}

sys.print = function(msg) {
  putsm.push(msg);
}

