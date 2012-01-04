var cron = require('cron')
  , exec = require('child_process').exec;

function log(err, stdout, stderr) {
  console.log('stdout: ' + stdout);
  console.log('stderr: ' + stderr);
  if (err !== null) {
     console.log('error: ' + error);
  }
}

// Gollum auto push
new cron.CronJob('0 0 * * *', function() {
  process.chdir('/home/rockdoli/www/gollum-wiki/');
  exec('.git/hooks/post-commit', log);
  console.log('Gollum wikin pushed at : ' + new Date);      
});

// Thinkup update
new cron.CronJob('0 5 * * *', function() {
  exec('cd /var/www/apache/thinkup/crawler/;export THINKUP_PASSWORD=' + process.env["THINKUP_PASS"]+ '; /usr/bin/php crawl.php outsideris@gmail.com', log);
  console.log('Thinkup updated at : ' + new Date);      
});

new cron.CronJob('0 17 * * *', function() {
  exec('cd /var/www/apache/thinkup/crawler/;export THINKUP_PASSWORD=' + process.env["THINKUP_PASS"]+ '; /usr/bin/php crawl.php outsideris@gmail.com', log);
  console.log('Thinkup updated at : ' + new Date);      
});