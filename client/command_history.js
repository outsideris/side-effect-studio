$(function() {
	CommandLineHistory.setup();
});

var CommandLineHistory = {

	setup: function() {
		var $command_line_history = $('#command_line_history');
		if (!$command_line_history.length) {
			$('<div />', {
				id: 'command_line_history',
				text: 'command_line_history'
			}).appendTo($('body'));
		}
	},

	log: function(msg) {
		$('<div />', {
			text: msg
		}).appendTo($('#command_line_history'));

	},

	trimmer: /^\s*(.+)\s*$/m,

	trimWhitespace: function(cmd) {
		if (!cmd) {
			return '';
		}
		var matches = this.trimmer.exec(cmd);
		if (matches && matches.length == 2) {
			return matches[1];
		}
	}

};

(function($) {

	$.commandLineHistory = function(selector) {

		// Create a hidden #command_line_history id on the page
		$(selector).live('keydown', function(e) {

			if (e.keyCode === 38) {
				var tmp = $('#command_line_history div:last').text();
				log(tmp);
				$(selector + ':last').val(tmp);
				return;
			}

			if (e.keyCode === 40) {
				App.commandFromHistory('down');
				return;
			}

			if (e.keyCode === 13) {
				$target = $(e.target);
				var cmd = CommandLineHistory.trimWhitespace($target.attr('value'));
				log(cmd);
				CommandLineHistory.log(cmd);
				return;
			}

		});
	};
})(jQuery);

jQuery.commandLineHistory('.readLine');

