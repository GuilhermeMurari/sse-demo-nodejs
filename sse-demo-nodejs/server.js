
const express = require('express');
const bodyParser = require('body-parser');
var SSE = require('./sse');

var app = express();
app.use(bodyParser.json());

var engine = {
    "port" : 9090
};

app.get("/events", function(req, res) {
	SSE.registryClient(req, res);
});

app.get("/push-event", function(req, res) {
	SSE.notifyAll(req, res);
});

app.get("/", function(req, res) {
	res.send("UP!");
});

var server = app.listen(engine.port, function() {
    console.log('Listening on port %d', server.address().port);
});