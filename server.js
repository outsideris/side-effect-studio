var sys = require('sys'),
express = require('express'),
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