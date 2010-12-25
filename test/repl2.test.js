// Run $ expresso

// Force test environment
process.env.NODE_ENV = 'test';

var repl2 = require('../repl2.js'),
    assert = require('assert');
    
module.exports = {
    // stripBrace
    'test stripBrace brace in last': function() {
        assert.equal('whoami', repl2.stripBrace('whoami()'));
    },
    'test stripBrace : brace in middle': function() {
        assert.equal('test()test', repl2.stripBrace('test()test'));
    },
};