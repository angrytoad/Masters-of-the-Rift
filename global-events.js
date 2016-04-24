module.exports = function(io, Models) {

    var express = require('express');
    var app = express();
    var server = require('http').Server(app);
    var bcrypt = require('bcrypt-nodejs');
    //var io = require('./app.js');

    // On Global Socket Connection
    io.on('connection', function(socket)
    {

        socket.on('connectionAttemptEvent', function(data)
        {
            //Function forchecking server connectivity
            socket.emit('connectedEvent', {connected: true});
        });

        socket.on('disconnect', function()
        {
            // Function for handling disconnects
            socket.emit('clientDisconnectedEvent', {connected: false});
        });

        socket.on('loginRequest', function(data) {

            // A function for handling registration events
            console.log(data);
            // Validate Input data
            // var $filterRegEx = '/[a-z]|[A-Z]|[0-9]| ';
            // var $passFilter = '/[0-9]';
            // if (data.login.summoner.search($filterRegEx) != -1) {
            //     socket.emit('regErrorEvent', {error: 'Invalid Characters in summoner name.'});
            // } else if (data.login.password.length <= 8 || data.login.password.search($passFilter) == -1) {
            //     socket.emit('regErrorEvent', {error: 'Password length must be 8 characters or greater and contain at least one number.'});
            // }

            // Check to see if a user of that name exists in the database

            console.log('Checking if user is in DB!');
            $id = data.login.region + '-' + data.login.summoner;
            Models.Users.findOne({loginId: $id}, 'loginId region summonerName password salt', function(err, user) {
                if (err) {
                    console.log(err + ':(');
                    socket.emit(loginErrorEvent, {error: err});
                }  else {
                    console.log(user + ':)');
                    var $dbUser = user;
                }
            });
            if (typeof $dbUser == 'undefined' || $dbUser === null) {
                socket.emit('noUserFoundEvent', {});
            } else {

                // Attempt login / password auth
                if (bcrypt.compareSync(data.login.password, $dbUser.password)) {
                    //Login Sucessful
                    socket.emit('loginSucessEvent', {summonerName: user.summonerName});
                } else {
                    // Login Failed
                    socket.emit('loginFailedEvent', {err: 'Bad Password.'});
                }
            }

        });

        socket.on('resisterRequest', function(data) {

            // Validate Input data
            // var $filterRegEx = '/[a-z]|[A-Z]|[0-9]| ';
            // var $passFilter = '/[0-9]';
            // if (data.login.summoner.search($filterRegEx) != -1) {
            //     socket.emit('regErrorEvent', {error: 'Invalid Characters in summoner name.'});
            // } else if (data.login.password.length <= 8 || data.login.password.search($passFilter) == -1) {
            //     socket.emit('regErrorEvent', {error: 'Password length must be 8 characters or greater and contain at least one number.'});
            // }

            // Check to see if a user of that name exists in the database

            console.log('Checking if user is in DB!');
            $id = data.login.region + '-' + data.login.summoner;
            Models.Users.findOne({loginId: $id}, 'loginId region summonerName password salt', function(err, user) {
                if (err) {
                    console.log(err + ':(');
                    socket.emit(loginErrorEvent, {error: err});
                }  else {
                    console.log(user + ':)');
                    var $dbUser = user;
                }
            });
            if ($dbUser === null) {
                socket.emit('noUserFoundEvent', {});
            } 

        });

        socket.on('matchForGameEvent', function(data)
        {
            // Function for finding a random match from other users in the queue 
        });



    });

}


