var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);



server.listen(80);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/app/index.html');
    console.log('Root request made');
});

