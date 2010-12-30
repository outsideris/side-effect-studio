var sys = require('sys'),
fs = require('fs'),
url = require('url'),
child_process = require('child_process'),
qs = require('querystring'),
express = require('express'),
repl2 = require('./repl/repl2'),
sideeffect = require('./controllers/sideeffect'),
wiki = require('./controllers/gollum'),
site_vhosts = [],
vhost;

// setting vhosts
site_vhosts.push(express.vhost('sideeffect.kr', sideeffect));
site_vhosts.push(express.vhost('www.sideeffect.kr', sideeffect));
site_vhosts.push(express.vhost('wiki.sideeffect.kr', wiki));

vhost = express.createServer.apply(this, site_vhosts);

if (!module.parent) {
    sideeffect.listen(3000);
    wiki.listen(3001);
    vhost.listen(80);
}