// Run $ expresso

// Force test environment
process.env.NODE_ENV = 'test';

var server = require('../server.js'),
    child_process = require('child_process'),
    assert = require('assert');
    
module.exports = {
    // static test
    'test Staticfiles URL: cufon-yui.js': function() {
        assert.response(server, {
            url: '/javascripts/cufon-yui.js',
            method: 'GET'
        }, {
            status: 200
        });
    },
    'test Staticfiles URL: Orbitron_900-Orbitron_700.font.js': function() {
        assert.response(server, {
            url: '/javascripts/Orbitron_900-Orbitron_700.font.js',
            method: 'GET'
        }, {
            status: 200
        });
    },
    'test Staticfiles URL: nodejs-badge.png': function() {
        assert.response(server, {
            url: '/images/nodejs-badge.png',
            method: 'GET'
        }, {
            status: 200
        });
    },
    'test Staticfiles URL: PoweredMongoDBbrown.png': function() {
        assert.response(server, {
            url: '/images/PoweredMongoDBbrown.png ',
            method: 'GET'
        }, {
            status: 200
        });
    },
    'test Staticfiles URL: common-style.css': function() {
        assert.response(server, {
            url: '/stylesheets/common-style.css',
            method: 'GET'
        }, {
            status: 200
        });
    },
    'test Staticfiles URL: REPL-style.css': function() {
        assert.response(server, {
            url: '/stylesheets/REPL-style.css',
            method: 'GET'
        }, {
            status: 200
        });
    },
    
    // Controller Test
    'test root controller URL': function() {
        assert.response(server, {
            url: '/',
            method: 'GET'
        }, {
            status: 200
        });
    },
    'test version URL': function() {
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
                assert.eql({"nodejs_version":stdout}, version)
            });
        });
    },
};