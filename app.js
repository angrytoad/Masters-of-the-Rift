var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var clients = {};

app.use("/assets", express.static(__dirname + '/app/assets'));
app.use("/components", express.static(__dirname + '/app/components'));
app.use("/scripts", express.static(__dirname + '/app/scripts'));
app.use("/styles", express.static(__dirname + '/app/styles'));


server.listen(80);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/app/index.html');
    console.log('Root request made');
});

io.on('connection', function(socket) {

	socket.on('connectionAttemptEvent', function(data) {

		//Function forchecking server connectivity

		socket.emit('connectedEvent', {connected: true});
	});

	socket.on('disconnect', function() {

		// Function for handling disconnects

		socket.emit('clientDisconnectedEvent', {connected: false});
	});

	socket.on('loginEvent', function(data) {

		// Function for handling session logins
		// Accepts a data object containing a summoner name and region - also if the login is guest or real
		if (data.guest) {
			var $name = 'nigger';
		}

	});

	socket.on('matchForGameEvent', function(data) {

		// Function for finding a random match from other users in the queue

	});

})