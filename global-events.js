var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// On Global Socket Connection
io.on('connection', function(socket)
{



    socket.on('connectionAttemptEvent', function(data)
    {
        //Function forchecking server connectivity
        socket.emit('connectedEvent', {connected: true});
    });

    socket.on('request')



    socket.on('disconnect', function()
    {
        // Function for handling disconnects
        socket.emit('clientDisconnectedEvent', {connected: false});
    });



    socket.on('loginEvent', function(data)
    {
        // Function for handling session logins
        // Accepts a data object containing a summoner name and region - also if the login is guest or real
        if (data.guest) {
            var $name = 'nigger';
        }
    });



    socket.on('matchForGameEvent', function(data)
    {
        // Function for finding a random match from other users in the queue
    });



});

