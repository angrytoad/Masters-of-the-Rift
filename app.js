/*
*	Main set up file for starting the node server - Initialises socket io, express and requires in other js files of logic
*/

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// Mongoose for handling interactions with mongodb

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/local');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// File containing site and game logic as well as providing a Models object for accessing the database

mongooseModels = require('./db.js');
var Models = new mongooseModels(mongoose);
var GlobalEvents = require("./global-events")(io, Models);
var MatchEvents = require("./match-events");
var MatchLogic = require("./match-logic");
var API = require("./api");

// Setup of files for react components

app.use("/assets", express.static(__dirname + '/app/assets'));
app.use("/components", express.static(__dirname + '/app/components'));
app.use("/scripts", express.static(__dirname + '/app/scripts'));
app.use("/styles", express.static(__dirname + '/app/styles'));

// Set server to listen on port 80

server.listen(80);

// On connection serve index.html

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/app/index.html');
});

// Export the io object to allow connection events and handling in other files

module.exports.io = io;