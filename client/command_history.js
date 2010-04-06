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
		return this._postion;
	},

	setPosition: function(pos) {
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

		this.setPosition($('#command_line_history div').length);
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

		$(selector).live('keydown', function(e) {
			var clh = Object.create(CommandLineHistory);
			clh.init();

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

