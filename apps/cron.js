var cron = require('cron')
  , exec = require('child_process').exec;

function log(err, stdout, stderr) {
  console.log('stdout: ' + stdout);
  console.log('stderr: ' + stderr);
  if (err !== null) {
     console.log('error: ' + err);
  }
}

// Gollum auto push
new cron.CronJob('40 1 * * *', function() {
  process.chdir('/home/outsider/apps/ruby/gollum/');
  exec('git push origin master', log);
  console.log('Gollum wikin pushed at : ' + new Date);      
});
