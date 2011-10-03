NOTE: This script is _not done_ yet.
====================================
Use it at your own risk.

Autocompletion
==============
The `autocomplete` option takes an object with functions `init` and `lookup`

_Example for Socket.IO_
```
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
```

