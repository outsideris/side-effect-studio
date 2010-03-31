var sys = require('sys'),version;

sys.exec('node --version', function(err, stdout, stderr) {
	if (err) {
		throw err;
	}
	version = stdout;
});

