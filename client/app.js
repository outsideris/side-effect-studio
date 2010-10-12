var App = App || {};

App.notice = function(msg) {
	alert(msg);
};

App.addLine = function() {
	var $line = $('<div />', {
		className: 'line'
	});
	$('input').attr("readonly", "readonly");
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

App.addResponseLine = function(msg, ignore_prompt) {

	$('<div />', {
		className: 'line',
		text: msg
	}).appendTo($('#terminal'));
	if (!ignore_prompt) {
		App.addLine();
		$('input:last').focus();
	}
};

App.send = function(cmd) {
	$.ajax({
		url: '/cmd',
		dataType: 'json',
		data: {
			cmd: cmd,
			uid: App.uid
		},
		success: function(data) {
			res = data.response;
			for (var i = 0; i < res.length; i++) {
                if (i === res.length -1) {
				    App.addResponseLine(res[i], false);
                } else {
                    App.addResponseLine(res[i], true);
                }
			}

			if (res.length === 0) {
				App.addLine();
				$('input:last').focus();
			}
		},
		error: function() {
			App.notice(cmd + ' could not be sent to the server');
		}
	});

};

$(function() {

	App.uid = Math.floor(Math.random() * 999999999999).toString();

	$('input.readLine').focus();

	$.ajax({
		url: '/version',
		success: function(data) {
			if (data.error) {
				App.notice(data.error);
			} else {
				var v = data.nodejs_version;
				$('#nodejs_version').text(data.nodejs_version);
			}
		},
		error: function() {
			App.notice('Error connecting to server');
		}
	});
	
	$("#terminal").click(function(e) {
    $('input:last').focus();
  });
  
});

$('.readLine').live('keypress', function(e) {

	if (e.keyCode !== 13) {
		return;
	}
	var cmd = $('.readLine:last').attr('value').replace('\n', '');
	if (cmd.length === 0) {
	  App.addLine();
	  $('input:last').focus();
		return;
	}
	if (cmd === 'help()') {
		App.showHelp();
	} else {
		App.send(cmd);
	}
});

App.showHelp = function() {
	App.addResponseHelpLine("    whoami()       show Outsider's profile.", true);
	App.addResponseHelpLine("    contacts()     show infomation to contact me", true);
	App.addResponseHelpLine("    projects()     list projects I done,", true);
	App.addResponseHelpLine("    skills()       list skills I have");
};

App.addResponseHelpLine = function(msg, ignore_prompt) {
  $('<div class="line"><pre>' + msg + '</pre></div>').appendTo($('#terminal'));
  if (!ignore_prompt) {
    App.addLine();
    $('input:last').focus();
  }
};

jQuery.commandLineHistory('.readLine');
