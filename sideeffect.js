require('nodetime').profile();

var util = require('util'),
    express = require('express'),
    sideeffect = require('./controllers/sideeffect'),
    wiki = require('./controllers/gollum'),
    labs = require('./controllers/labs'),
    thinkup = require('./controllers/thinkup'),
    gitlabhq = require('./controllers/gitlabhq'),
    cron = require('./apps/cron'),
    site_vhosts = [],
    vhost;

// setting vhosts
site_vhosts.push(express.vhost('sideeffect.kr', sideeffect));
site_vhosts.push(express.vhost('www.sideeffect.kr', sideeffect));
site_vhosts.push(express.vhost('wiki.sideeffect.kr', wiki));
site_vhosts.push(express.vhost('labs.sideeffect.kr', labs));
site_vhosts.push(express.vhost('thinkup.sideeffect.kr', thinkup));
site_vhosts.push(express.vhost('gitlab.sideeffect.kr', gitlabhq));

vhost = express.createServer.apply(this, site_vhosts);

if (!module.parent) {
    sideeffect.listen(8003);
    wiki.listen(8004);
    labs.listen(8005);
    thinkup.listen(8006);
    gitlabhq.listen(8007);
    vhost.listen(8000);
}

util.debug('sideeffect server started');
