var sys = require('sys'),
    http = require('http'),
    gollum = module.exports;

gollum.http = http.createClient(4567, 'localhost');

gollum.getGollumContents = function(url) {
  var request = gollum.http.request('GET', '/', {'host': 'localhost'});
  request.end();
  request.on('response', function (response) {
    console.log('STATUS: ' + response.statusCode);
    console.log('HEADERS: ' + JSON.stringify(response.headers));
    response.setEncoding('utf8');
    response.on('data', function (chunk) {
      console.log('BODY: ' + chunk);
    });
  });
  
}