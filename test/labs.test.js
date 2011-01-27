// Run $ expresso

var server = require('../controllers/labs.js'),
    child_process = require('child_process'),
    assert = require('assert');
    

module.exports = {
    // static test
    'test static request': function() {
        assert.response(server, {
            url: '/index.html',
            method: 'GET'
        }, {
            status: 200,
            body: "It's work\n"
        });
    },
};
