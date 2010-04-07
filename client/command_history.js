if (typeof Object.create !== 'function') {
	Object.create = function(o) {
		function F() {}
		F.prototype = o;
		return new F();
	};
}

$(function() {
	CommandLineHistory.setup();
});

var CommandLineHistory = {

	init: function() {
		this._position = null;
	},

	getPosition: function() {
		return this._position;
	},

	setPosition: function(pos) {
		if (pos < 0) {
			pos = 0;
		}
		this._position = pos;
	},

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

		var tmp = $('#command_line_history div').length;
		this.setPosition(tmp - 1);
	},

	trimWhitespace: function(cmd) {
		if (!cmd) {
			return '';
		}
		var trimmer = /^\s*(.+)\s*$/m,
		matches = trimmer.exec(cmd);
		if (matches && matches.length == 2) {
			return matches[1];
		}
	},

	updatePrompt: function(pos, selector) {
		this.setPosition(pos);
		var selector_with_pos = '#command_line_history div:eq(' + pos + ')',
		text = $(selector_with_pos).text();
		$(selector + ':last').val(text);
	}

};

(function($) {

	$.commandLineHistory = function(selector) {

		var clh = Object.create(CommandLineHistory);
		clh.init();

		$(selector).live('keydown', function(e) {
			var current_pos = clh.getPosition();

			if (e.keyCode === 38) {
				clh.updatePrompt(current_pos - 1, selector);
				return;

			} else if (e.keyCode === 40) {
				log_length = $('#command_line_history div').length;
				if (current_pos < log_length) {
					current_pos = current_pos + 1;
				}
				clh.updatePrompt(current_pos, selector);
				return;

			} else if (e.keyCode === 13) {
				$target = $(e.target);
				var cmd = clh.trimWhitespace($target.attr('value'));
				if (cmd.length > 0) {
					clh.log(cmd);
				}
				return;
			}

		});
	};
})(jQuery);
