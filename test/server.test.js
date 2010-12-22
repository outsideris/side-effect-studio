// Run $ expresso

// Force test environment
process.env.NODE_ENV = 'test';

var server = require('../server.js'),
    assert = require('assert');
    
module.exports = {
    'test Staticfiles:cufon-yui.js': function() {
        assert.response(server, {
            url: '/javascripts/cufon-yui.js',
            method: 'GET'
        }, {
            status: 200
        });
    }
};