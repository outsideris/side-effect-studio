var sys = require('sys'),
express = require('express'),
app = module.exports = express.createServer();

app.configure(function() {
    app.use(express.staticProvider(__dirname.replace('/controllers', '') + '/labs'));
});
