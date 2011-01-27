var sys = require('sys'),
    express = require('express'),
    sideeffect = require('./controllers/sideeffect'),
    wiki = require('./controllers/gollum'),
    labs = require('./controllers/labs'),
    site_vhosts = [],
    vhost;

// setting vhosts
site_vhosts.push(express.vhost('sideeffect.kr', sideeffect));
site_vhosts.push(express.vhost('www.sideeffect.kr', sideeffect));
site_vhosts.push(express.vhost('wiki.sideeffect.kr', wiki));
site_vhosts.push(express.vhost('labs.sideeffect.kr', labs));

vhost = express.createServer.apply(this, site_vhosts);

if (!module.parent) {
    sideeffect.listen(8003);
    wiki.listen(8004);
    labs.listen(8005);
    vhost.listen(8000);
}

sys.debug('sideeffect server started');
