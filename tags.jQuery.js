(function ($) {
	var socketio = {
		io: null,
		lookup: function (str, cb) {
			var io = this.io;

			io.emit('lookup', { ns: 'content', str: str });
			io.on('lookup', function lookup (data) {
				if (data.str === str) {
					io.removeListener('lookup', lookup);
					cb(data.tags);
				}
			});
		},
		initialize: function () {
			this.io = io.connect('/tags');
		}
	};
	$.fn.tagInput = function (opts) {
		// Default options
		var opts = $.extend({
			'autocomplete': socketio,
			'delimiter': ','
		}, opts);
		
		this.each(function () {
			var actualInput = $(this).hide();
			var options = actualInput.data('tagInput');

			if (!options) {
				actualInput.data('tagInput', opts);
				var options = opts;
			}

			if (options.autocomplete) {
				options.autocomplete.initialize();
			}

			// Wrap input
			var wrapper = actualInput.wrap('<div class="tag-input"></div>').parent();

			// Add tag holder
			var tagHolder = $('<ul class="tags"></ul>').appendTo(wrapper);

			// Add autocomplete list
			var list = $('<ul class="autocomplete-list"></ul>').appendTo(wrapper);

			// Add tag adding input
			var input = $('<input>').appendTo(wrapper);

			// Save shit to options
			options.list = list;
			options.wrapper = wrapper;
			options.tagHolder = tagHolder;
			input.data('tagInput', options);

			// Parse input's value and add any tags that are already there.
			var val = actualInput.val();
			var tags = val.split(options.delimiter);
			for (var i = 0, l = tags.length; i < l; ++i) {
				actualInput.addTag(tags[i]);
			}


			// Add events
			input.bind('keydown', function (e) {
				console.log(e);
				switch(e.keyCode) {
					case 9:
					case 13:
						// tab key
						actualInput.addTag(input.val());
						e.preventDefault();
						break;
					case 27:
						// esc key
						$(this).val('');
						break;
					default:
//						debugger;
				}
			});
		});
	};

	$.fn.addTag = function (str) {
		var options = this.data('tagInput');
		var tags = this.data('tagInput').tagHolder.children().map(function (i, item) {
			return $(item).text();
		});

		console.log(tags);

		options.autocomplete.lookup(str, function (data) {
			if (data.length === 1) {
				$('<li></li>').text(data[0]).appendTo(options.tagHolder);
			}
		});
	};
})(jQuery);