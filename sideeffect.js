var util = require('util'),
    express = require('express'),
    sideeffect = require('./controllers/sideeffect'),
    wiki = require('./controllers/gollum'),
    labs = require('./controllers/labs'),
    thinkup = require('./controllers/thinkup'),
    cron = require('./apps/cron'),
    site_vhosts = [],
    vhost;

// setting vhosts
site_vhosts.push(express.vhost('sideeffect.kr', sideeffect));
site_vhosts.push(express.vhost('www.sideeffect.kr', sideeffect));
site_vhosts.push(express.vhost('wiki.sideeffect.kr', wiki));
site_vhosts.push(express.vhost('labs.sideeffect.kr', labs));
site_vhosts.push(express.vhost('thinkup.sideeffect.kr', thinkup));

vhost = express.createServer.apply(this, site_vhosts);

if (!module.parent) {
    sideeffect.listen(8003);
    wiki.listen(8004);
    labs.listen(8005);
    thinkup.listen(8006);
    vhost.listen(8000);
}

util.debug('sideeffect server started');
