NOTE: This script is _mostly_ done.
===================================
However, it's likely a tad rough around the edges.

Also, it has no CSS; I'll leave that bit to you.

Autocompletion
==============
The `autocomplete` option takes an object with functions `init` and `lookup`

Example for Socket.IO
---------------------

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
		init: function () {
			this.io = io.connect('/tags');
		}
	};

Styling
=======

`div.tag-input` &mdash; Container element  
`ul.tags` &mdash; List of added tags  
`ul.autocomplete-list` &mdash; Autocomplete results list  
`ul.autocomplete-list > li` &mdash; Autocomplete results entry  
`ul.tags > li > span.tag-name` &mdash; Name on an added tag  
`ul.tags > li > span.remove-button` &mdash; "Remove Tag" Button on an added tag  

Planned Features
================

* Ctrl+click to select multiple tags in either list (with buttons appearing to remove/add)
* Shift+click to add a tag without clearing the autocomplete
* Better value handling (not just `Array.join`, preferably something that escapes values)
* Keyboard-navigable autocompletion list
* Tab to insert first autocomplete result