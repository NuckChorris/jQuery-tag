NOTE: This script is _not done_ yet.
====================================
Use it at your own risk.

Autocompletion
==============
The `autocomplete` option takes an object with functions `init` and `lookup`

<<<<<<< HEAD
Example for Socket.IO
---------------------
=======
_Example for Socket.IO_
>>>>>>> 96675a20ab07e77ee9278fe6fec722c813c84307

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

