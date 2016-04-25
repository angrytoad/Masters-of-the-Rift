module.exports = function(io, Models) {

    var express = require('express');
    var app = express();
    var server = require('http').Server(app);
    var bcrypt = require('bcrypt-nodejs');
    var uuid = require('uuid');
    
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

            //console.log('Saved session data is: '+socket.handshake.session.test);

            // A function for handling registration events

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
                    if ($dbUser === null) {
                        socket.emit('noUserFoundEvent', {});
                    } else {

                        // Attempt login / password auth
                        $hash = bcrypt.hashSync(data.login.password, $dbUser.salt);
                        console.log($hash + '--' + $dbUser.password + '--' + $dbUser.salt);
                        if ($hash === $dbUser.password) {
                            //Login Sucessful
                            $token = uuid.v4();
                            $session = null;
                            Models.Sessions.findOne({loginId: $id}, 'loginId sessionId time', function (err, session) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    $session = session;
                                }
                            })
                            if ($session == null) {
                                var $newSession = new Models.Sessions({loginId: $id, sessionId: $token, time: Date.now()});
                                $newSession.save(function (err, session) {
                                    if (err) {
                                        console.log(err);
                                        socket.emit('loginFailedEvent', {error: 'Failed to enter session data.'});
                                    } else {
                                        socket.emit('loginSuccessEvent', {summonerName: user.summonerName, loginId: user.loginId, token: $token});
                                    }
                                });
                            } else {
                                Models.Sessions.update({loginId: $id}, {$set: {sessionId: $token}}, function (err, session) {
                                    if (err) {
                                        socket.emit('loginFailedEvent', {error: 'Session id update failed.'});
                                    } else {
                                        socket.emit('loginSuccessEvent', {summonerName: user.summonerName, loginId: user.loginId, token: $token});
                                    }
                                }); 
                            }  
                        } else {
                            // Login Failed
                            socket.emit('loginFailedEvent', {error: 'Bad username/password combination.'});
                        }
                    }
                }
            });

        });

        socket.on('requestUserStats', function (data) {
            console.log(data);
            if (typeof data.session == 'undefined') {
                socket.emit('authErrorEvent', {error: 'No session data.'});
            } else {
                var $res = Models.validateSession(data.session.token, data.session.loginId);
                console.log($res);
                if ($res.err) {
                    console.log($res.msg);
                    socket.emit('authErrorEvent', {error: $res.msg});
                } else {
                    socket.emit('userStatsEvent', {});
                }
            }
        })

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
                                socket.emit('registrationSuccessEvent', {summonerName: data.login.summonerName});
                            }
                        });

                    } else {
                        socket.emit('registrationFailedEvent', {error: 'User already exists.'});
                    }
                }
            });

        });

        socket.on('matchForGameEvent', function(data)
        {
            // Function for finding a random match from other users in the queue 
        });



    });

}


