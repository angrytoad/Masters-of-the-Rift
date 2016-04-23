var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var GlobalEvents = require("./global-events");
var MatchEvents = require("./match-events");
var MatchLogic = require("./match-logic");
var API = require("./api");

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

