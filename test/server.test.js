// Run $ expresso

// Force test environment
process.env.NODE_ENV = 'test';

var server = require('../server.js'),
    assert = require('assert');
    
module.exports = {
    // static test
    'test Staticfiles: cufon-yui.js': function() {
        assert.response(server, {
            url: '/javascripts/cufon-yui.js',
            method: 'GET'
        }, {
            status: 200
        });
    },
    'test Staticfiles: Orbitron_900-Orbitron_700.font.js': function() {
        assert.response(server, {
            url: '/javascripts/Orbitron_900-Orbitron_700.font.js',
            method: 'GET'
        }, {
            status: 200
        });
    },
    'test Staticfiles: nodejs-badge.png': function() {
        assert.response(server, {
            url: '/images/nodejs-badge.png',
            method: 'GET'
        }, {
            status: 200
        });
    },
    'test Staticfiles: PoweredMongoDBbrown.png': function() {
        assert.response(server, {
            url: '/images/PoweredMongoDBbrown.png ',
            method: 'GET'
        }, {
            status: 200
        });
    },
    'test Staticfiles: common-style.css': function() {
        assert.response(server, {
            url: '/stylesheets/common-style.css',
            method: 'GET'
        }, {
            status: 200
        });
    },
    'test Staticfiles: REPL-style.css': function() {
        assert.response(server, {
            url: '/stylesheets/REPL-style.css',
            method: 'GET'
        }, {
            status: 200
        });
    },
};