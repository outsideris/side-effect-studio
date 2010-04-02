var App = App || {};

// show a message to user
App.notice = function(msg) {

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

