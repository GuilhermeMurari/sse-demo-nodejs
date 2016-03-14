(function() {
	const crypto = require('crypto');
	var clients = {};
	var hash;

	var SSE  = {
		"registryClient" : function(req, res) {
			//About 24h to timeout
			req.socket.setTimeout(0x7FFFFFFF);

			res.writeHead(200, {
				"Content-Type": "text/event-stream",
				"Cache-Control": "no-cache",
				"Connection": "keep-alive"
			});
			res.write('\n\n');

			hash = crypto.randomBytes(20).toString("hex");
			this.addClient(req, res, hash);
		},

		"addClient" : function(req, res, hash) {
			clients[hash] = res;
			req.on("close", this.close(hash));
			console.log("Client with hash " + hash + " added");
			this.open(res, hash);
		},

		"notifyAll" : function(req, res) {
			var data = req.body;

			for (var hash in clients) {
				this.writeData(hash, this.buildClientWithData(hash, data));
				console.log("client with id " + hash + " notified");
			}
			res.send("Notified!");
		},

		"writeData" : function(hash, data) {
			clients[hash].write("data: " + data + "\n\n");
		},

		"close" : function(hash) {
			return function() {
				console.log("Delete " + hash);
				delete clients[hash];	
			};
		},

		"open" : function(res, hash) {
			var json = this.buildClientWithData(hash);

			res.write("data: " + json + "\n\n");
		},

		"buildClientWithData" : function(hash, data) {
			var client = {
				"hash" : hash,
				"data" : data || {}
			}

			return JSON.stringify(client);
		}
	};

	module.exports = SSE;
})();