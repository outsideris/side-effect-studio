// Run $ expresso

// Force test environment
process.env.NODE_ENV = 'test';

var gollum = require('../apps/gollum-connector.js'),
    server = require('../controllers/gollum.js'),
    assert = require('assert');
    
module.exports = {
    'test request for root controller : /': function() {
        assert.response(server, {
            url: '/',
            method: 'GET'
        }, {
            status: 200,
            body: 'hello wiki'
        });
    },
};