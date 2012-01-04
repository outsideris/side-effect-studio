var util = require('util'),
express = require('express'),
app = module.exports = express.createServer();

app.configure(function() {
    app.use(express.static(__dirname.replace('/controllers', '') + '/labs'));
});
