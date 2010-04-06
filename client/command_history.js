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

var CommandLineHistoryPosition = function(val) {
	var value = val;

	this.getValue = function() {
		return value;
	};

	this.setValue = function(val) {
		value = val;
	};

};

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
		log(tmp);
		this.setPosition(tmp - 1);
		log(this.getPosition());
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
	}

};

(function($) {

	$.commandLineHistory = function(selector) {

		var clh = Object.create(CommandLineHistory);
		clh.init();

		$(selector).live('keydown', function(e) {
			log(clh.getPosition());

			if (e.keyCode === 38) {
				var current_pos = clh.getPosition();
				var selector_with_pos = '#command_line_history div:eq(' + current_pos + ')';
				log(selector_with_pos);
				var tmp = $(selector_with_pos).text();
				log(tmp);
				clh.setPosition(current_pos - 1);
				$(selector + ':last').val(tmp);
				return;
			}

			if (e.keyCode === 40) {
				App.commandFromHistory('down');
				return;
			}

			if (e.keyCode === 13) {
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

jQuery.commandLineHistory('.readLine');

