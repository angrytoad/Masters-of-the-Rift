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
            var $dbUser = null;
            $id = data.login.region + '-' + data.login.summoner;
            Models.Users.findOne({loginId: $id}, 'loginId region summonerName password salt', function(err, user) {
                if (err) {
                    console.log(err + ':(');
                    socket.emit('loginErrorEvent', {error: err});
                }  else {
                    console.log(user + ':)');
                    $dbUser = user;
                }
            });
            if ($dbUser === null) {
                socket.emit('noUserFoundEvent', {});
            } else {

                // Attempt login / password auth
                if (bcrypt.compareSync(data.login.password, $dbUser.password)) {
                    //Login Sucessful
                    socket.emit('loginSucessEvent', {summonerName: user.summonerName, loginId: user.loginId});
                } else {
                    // Login Failed
                    socket.emit('loginFailedEvent', {error: 'Bad Password.'});
                }
            }

        });

        socket.on('registerRequest', function(data) {

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
            var $dbUser = null;
            $id = data.login.region + '-' + data.login.summoner;
            Models.Users.findOne({loginId: $id}, 'loginId region summonerName password salt', function(err, user) {
                if (err) {
                    console.log(err + ' :(');
                    socket.emit(loginErrorEvent, {error: err});
                }  else {
                    console.log(user + ' :)');
                    $dbUser = user;
                }
            });
            if ($dbUser === null) {
                // User does not already exist
                $loginId = data.login.region + '-' + data.login.summoner;
                $salt = bcrypt.genSaltSync(10);
                $hash = bcrypt.hashSync(data.login.password, $salt);
                var $newUser = new Models.Users({loginId: $loginId, summonerName: data.login.summoner, region: data.login.region, password: $hash, salt: $salt});
                $newUser.save(function (err, $newUser) {
                    if (err) {
                        console.log(err + ' :(');
                        socket.emit('registrationFailedEvent', {error: err});
                    } else {
                        socket.emit('registrationSucessfulEvent', {summonerName: data.login.summonerName});
                    }
                });

            } else {
                socket.emit('registrationFailedEvent', {error: 'User already exists.'});
            }


        });

        socket.on('matchForGameEvent', function(data)
        {
            // Function for finding a random match from other users in the queue 
        });



    });

}


