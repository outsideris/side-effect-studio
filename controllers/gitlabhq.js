var httpProxy = require('http-proxy');

module.exports = httpProxy.createServer(8010, 'localhost');

