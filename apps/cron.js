var cron = require('cron')
  , exec = require('child_process').exec;

function log(err, stdout, stderr) {
  console.log('stdout: ' + stdout);
  console.log('stderr: ' + stderr);
  if (err !== null) {
     console.log('error: ' + error);
  }
}

new cron.CronJob('0 0 * * *', function() {
  process.chdir('/home/rockdoli/www/gollum-wiki/');
  exec('.git/hooks/post-commit', log);
  console.log('Gollum wikin pushed at : ' + new Date);      
});

