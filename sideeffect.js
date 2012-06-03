var util = require('util'),
    express = require('express'),
    sideeffect = require('./controllers/sideeffect'),
    wiki = require('./controllers/gollum'),
    cron = require('./apps/cron');

if (!module.parent) {
    sideeffect.listen(8003);
    wiki.listen(8004);
}

util.debug('sideeffect server started');
