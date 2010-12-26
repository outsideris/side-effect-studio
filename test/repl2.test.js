// Run $ expresso

// Force test environment
process.env.NODE_ENV = 'test';

var repl2 = require('../repl/repl2.js'),
    assert = require('assert');
    
module.exports = {
    // stripBrace
    'test stripBrace : brace in last': function() {
        assert.equal('whoami', repl2.stripBrace('whoami()'));
    },
    'test stripBrace : brace in middle': function() {
        assert.equal('test()test', repl2.stripBrace('test()test'));
    },
    
    // userCommand
    'test userCommand : whoami()': function() {
        assert.equal(true, repl2.userCommand('whoami()'));
    },
    'test userCommand : contacts()': function() {
        assert.equal(true, repl2.userCommand('contacts()'));
    },
    'test userCommand : projects()': function() {
        assert.equal(true, repl2.userCommand('projects()'));
    },
    'test userCommand : skills()': function() {
        assert.equal(true, repl2.userCommand('skills()'));
    },
    'test userCommand : somethings()': function() {
        assert.equal(false, repl2.userCommand('shomthins()'));
    },
    
    // parseREPLKeyword
    'test parseREPLKeyword : .break': function() {
        assert.equal(true, repl2.parseREPLKeyword('.break'));
    },
    'test parseREPLKeyword : .clear': function() {
        assert.equal(true, repl2.parseREPLKeyword('.clear'));
    },
    'test parseREPLKeyword : something': function() {
        assert.equal(false, repl2.parseREPLKeyword('something'));
    },
    
    // trimWhitespace
    'test trimWhitespace : whitespace with start and end': function() {
        assert.equal('test', repl2.trimWhitespace(' test '));
    },
    'test trimWhitespace : whitespace with end': function() {
        assert.equal('te st', repl2.trimWhitespace('te st '));
    },
    'test trimWhitespace : whitespace with start': function() {
        assert.equal('t est', repl2.trimWhitespace(' t est'));
    },
    
    // convertToScope
    'test convertToScope : define variable command': function() {
        assert.equal('exports.scope.393320152069.foo = "bar";', repl2.convertToScope('var foo = "bar";', '393320152069'));
    },
    'test convertToScope : define function command': function() {
        assert.equal('foo = function foo() {};', repl2.convertToScope('function foo() {};', '393320152069'));
    },
};