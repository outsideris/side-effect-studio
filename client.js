var App = App || {};

// show a message to user
App.notice = function(msg) {
	alert(msg);
};

App.addLine = function() {
  var $line = $('<div />', {className: 'line'});
	$('<span />', {
		text: '> ',
		className: 'prompt'
	}).appendTo($line);

	$('<input />', {
		text: '',
		className: 'readLine'
	}).appendTo($line);

	$('#terminal').append($line);
};

App.addResponseLine = function(msg) {
	$('<div />', {
		className: 'line',
		text: msg
	}).appendTo($('#terminal'));
  App.addLine();
  $('input:last').focus();
};

App.send = function(cmd) {
	$.ajax({
		url: '/cmd',
		success: function(data) {
			App.addResponseLine(data.response);
		},
		error: function() {
			App.notice(cmd + ' could not be sent to the server');
		}
	});

};

$(function() {

	$('input.readLine').focus();

	$.ajax({
		url: '/version',
		success: function(data) {
			if (data.error) {
				App.notice(data.error);
			} else {
				var v = data.nodejs_version;
				log(v);
				$('#nodejs_version').text(data.nodejs_version);
			}
		},
		error: function() {
			App.notice('Error connecting to server');
		}
	});
});

$('.readLine').live('keypress', function(e) {
	if (e.keyCode !== 13) {
		return;
	}
	var cmd = $('.readLine').attr('value').replace('\n', '');
	App.send(cmd);
});

