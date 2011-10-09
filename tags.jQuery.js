(function ($) {
	var socketio = {
		io: null,
		lookup: function (str, cb) {
			var io = this.io;

			io.emit('lookup', { str: str });
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
			actualInput.val('');
			var tags = val.split(options.delimiter);
			for (var i = 0, l = tags.length; i < l; ++i) {
				actualInput.addTag(tags[i]);
			}


			// Add events
			input.bind('keydown', function (e) {
				switch(e.keyCode) {
					case 9:
					case 13:
						// tab key
						actualInput.addTag(input.val());
						e.preventDefault();
						$(this).val('');
						break;
					case 27:
						// esc key
						$(this).val('');
						break;
					default:
						// Dunno what to do here?
				}
			});
			var timeout = 0;
			input.bind('keyup', function (e) {
				switch(e.keycode) {
					case 9:
					case 13:
					case 27:
						// Do nothing.
						break;
					default:
						clearTimeout(timeout);
						if ($(this).val().length >= 3) {
							timeout = setTimeout(function(){
								console.log('lookup');
								options.autocomplete.lookup($(e.target).val(), function (data) {
									list.empty();
									for (var i = 0, l = data.length; i < l; ++i) {
										var item = $('<li></li>');
										item.text(data[i]);
										item.click(function () {
											input.val('');
											list.empty();
											actualInput.addTag($(this).text());
										});
										item.appendTo(list);
									}
								});
							}, 200);
						} else {
							list.empty();
						}
				}
			})
		});
	};

	$.fn.addTag = function (str) {
		var options = this.data('tagInput');
		var tags = [];
		var tags = options.tagHolder.children().map(function (i, item) {
			return $(item).text();
		}).toArray();

		var actualInput = this;

		if (tags.indexOf(str) === -1) {
			options.autocomplete.lookup(str, function (data) {
				if (data.length === 1) {
					var tag = $('<li></li>');
					$('<span class="tag-name"></span>').text(data[0]).appendTo(tag);
					tag.appendTo(options.tagHolder);

					var tags = actualInput.val().split(options.delimiter).filter(function(el) {
						return el.length > 0;
					});
					tags.push(data[0]);
					console.log(tags);
					actualInput.val(tags.join(options.delimiter));

					$('<span class="remove-button">X</span>').click(function () {
						actualInput.removeTag(tag);
					}).appendTo(tag);
				}
			});
		}
	};

	$.fn.removeTag = function (elOrStr) {
		var options = this.data('tagInput');

		if (elOrStr instanceof $) {
			var tags = this.val().split(options.delimiter);
			tags.splice(tags.indexOf(elOrStr.text()), 1);
			this.val(tags.join(options.delimiter));
			console.log(tags);
			elOrStr.remove();
		} else {
			options.tagHolder.children().each(function (i, item) {
				if ($(this).text() === elOrStr) {
					$(this).remove();
				}
			});
		}
	};
})(jQuery);