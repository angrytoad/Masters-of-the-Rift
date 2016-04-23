var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var GlobalEvents = require("./global-events");
var MatchEvents = require("./match-events");
var MatchLogic = require("./match-logic");
var API = require("./api");

var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var assert = require('assert');
var dburl = 'mongodb://localhost:27017';
MongoClient.connect(dburl, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to database server.");
  db.close();
});

app.use("/assets", express.static(__dirname + '/app/assets'));
app.use("/components", express.static(__dirname + '/app/components'));
app.use("/scripts", express.static(__dirname + '/app/scripts'));
app.use("/styles", express.static(__dirname + '/app/styles'));

server.listen(80);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/app/index.html');
    console.log('Root request made');
});

// Test Database Read/write

MongoClient.connect(dburl, function(err, db) {

	var insertDocument = function (db) {
		db.collection('users').insertOne({name: 'Salam', region: 'EUW'}, function (err, result) {
			assert.equal(err, null);
		    console.log("User Added!");
		});
	}
	insertDocument(db);
});

MongoClient.connect(dburl, function(err, db) {

	var findUsers = function(db) {
	   var cursor = db.collection('users').find( );
	   cursor.each(function(err, doc) {
	      assert.equal(err, null);
	      if (doc != null) {
	         console.dir(doc);
	      } 
	   });
	};
	findUsers(db);
});



