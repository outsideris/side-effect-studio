var sys = require('sys'),
fs = require('fs'),
qs = require('querystring'),
url = require('url'),
mongodb = require('mongodb'),
buffered_cmd = '',
repl2 = exports,
Db = mongodb.Db,
Server = mongodb.Server,
scopedVar = /^\s*var\s*([_\w\$]+)(.*)$/m,
scopeFunc = /^\s*function\s*([_\w\$]+)/,
putsm = [];

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
        cmd = repl2.stripBrace(cmd); 

        var db = new Db('sideeffect_main', new Server(process.env["MONGODB_HOST"], process.env["MONGODB_PORT"], {}));
        db.open(function(err, db) {
    			db.authenticate(process.env["MONGODB_USER"], process.env["MONGODB_PASS"], function() {
    	            if (err) { sys.debug("DB Authentication error!"); }
    				
    	            db.collection("trynode", function(err, collection) {
    	               collection.find({"cmd":cmd}, {"sort":"order"}, function(err, cursor) {
    	                  cursor.each(function(err, item) {
    	                     if (item != null) {
    	                         output.push(item.contents); 
    	                     } else {
    	                         res.send({
    	                            response: output   
    	                         });
    	                     }
    	                  });
    	                  db.close();
    	              });   
    	           }); 
    		   });       
        });
    } else {

	    buffered_cmd += _cmd;
	    buffered_cmd = repl2.convertToScope(buffered_cmd, uid);

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

repl2.stripBrace = function(cmd) {
   return cmd.replace(/\(\)$/, "");
}

sys.puts = function(msg) {
  putsm.push(msg);
}

sys.p = function(msg) {
  putsm.push(msg);
}

sys.print = function(msg) {
  putsm.push(msg);
}

