var httpProxy = require('http-proxy');

module.exports = httpProxy.createServer(9001, 'localhost');

