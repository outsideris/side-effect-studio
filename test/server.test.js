// Run $ expresso

// Force test environment
process.env.NODE_ENV = 'test';

var server = require('../server.js'),
    child_process = require('child_process'),
    assert = require('assert');
    
module.exports = {
    // static test
    'test request for static files : /javascripts/cufon-yui.js': function() {
        assert.response(server, {
            url: '/javascripts/cufon-yui.js',
            method: 'GET'
        }, {
            status: 200
        });
    },
    'test request for static files : /javascripts/Orbitron_900-Orbitron_700.font.js': function() {
        assert.response(server, {
            url: '/javascripts/Orbitron_900-Orbitron_700.font.js',
            method: 'GET'
        }, {
            status: 200
        });
    },
    'test request for static files : /images/nodejs-badge.png': function() {
        assert.response(server, {
            url: '/images/nodejs-badge.png',
            method: 'GET'
        }, {
            status: 200
        });
    },
    'test request for static files : /images/PoweredMongoDBbrown.png': function() {
        assert.response(server, {
            url: '/images/PoweredMongoDBbrown.png',
            method: 'GET'
        }, {
            status: 200
        });
    },
    'test request for static files : /stylesheets/common-style.css': function() {
        assert.response(server, {
            url: '/stylesheets/common-style.css',
            method: 'GET'
        }, {
            status: 200
        });
    },
    'test request for static files : /stylesheets/REPL-style.css': function() {
        assert.response(server, {
            url: '/stylesheets/REPL-style.css',
            method: 'GET'
        }, {
            status: 200
        });
    },
    
    // Controller Test
    'test request for root controller : /': function() {
        assert.response(server, {
            url: '/',
            method: 'GET'
        }, {
            status: 200
        });
    },
    'test request for /version': function() {
        assert.response(server, {
            url: '/version',
            method: 'GET'
        }, {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        },
        
        function(res) {
            var version = JSON.parse(res.body);
            child_process.exec('node --version', function(err, stdout, stderr) {
                if (err) throw err;
                assert.eql({"nodejs_version":stdout}, version);
            });
        });
    },
    
    // repl command Test
    'test request for /cmd': function() {
        assert.response(server, {
            url: '/cmd',
            method: 'GET'
        }, {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    },
    'test request for /cmd : command whoami()': function() {
        assert.response(server, {
            url: '/cmd?cmd=whoami()&uid=393320152069',
            method: 'GET',
        }, {
            status: 200,
            body: '{"response":["Nickname: Outsider","Front-end & Server-side Web Developer"]}',
            headers: { 'Content-Type': 'application/json' }
        });
    },
    'test request for /cmd : numeric': function() {
        assert.response(server, {
            url: '/cmd?cmd=1&uid=393320152069',
            method: 'GET',
        }, {
            status: 200,
            body: '{"response":["1"]}',
            headers: { 'Content-Type': 'application/json' }
        });
    },
    'test request for /cmd : undefined error': function() {
        assert.response(server, {
            url: '/cmd?cmd=a&uid=393320152069',
            method: 'GET',
        }, {
            status: 200,
            body: '{"response":["Error: ReferenceError: a is not defined"]}',
            headers: { 'Content-Type': 'application/json' }
        });
    },
    'test request for /cmd : simple JavaScript Command': function() {
        assert.response(server, {
            url: '/cmd?cmd=var%20test=1&uid=393320152069',
            method: 'GET',
        }, {
            status: 200,
            body: '{"response":["1"]}',
            headers: { 'Content-Type': 'application/json' }
        });
    },
};