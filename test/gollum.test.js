// Run $ expresso

// Force test environment
process.env.NODE_ENV = 'test';

var gollum = require('../apps/gollum.js'),
    assert = require('assert');
    
module.exports = {
    'test getGollumContents : get html from gollum server': function() {
        assert.equal('', gollum.getGollumContents(''));
    },
};