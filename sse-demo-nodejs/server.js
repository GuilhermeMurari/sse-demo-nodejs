
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

var engine = {
    "port" : 9090
};

var clients = {};
var lastKey = 0;

app.get('/events', function(req, res) {
	req.socket.setTimeout(99999999);

	res.writeHead(200, {
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache',
		'Connection': 'keep-alive'
	});
	res.write('\n');

	(function(lastKey) {
		clients[lastKey] = res; // <- Add this client to those we consider "attached"
		req.on("close", function(){delete clients[lastKey]}); // <- Remove this client when he disconnects
	})(++lastKey)
});

app.get('/store', function(req, res) {
	console.log(clients.length + "\n");
	for (var key in clients) {
		var data = "data goes here";
		clients[key].write("data: " + data + "\n\n");
		console.log("client with id " + key + " notified");
	}
});

var server = app.listen(engine.port, function() {
    console.log('Listening on port %d', server.address().port);
});