/*
 This is the queue object and contains all people who are currently in the queue.
 */
var $queue = {};

/*
 This is the matches object and contains all matches which are currently being played.
 */
var $matches = {};

module.exports = function(io, Models) {

    var express = require('express');
    var app = express();
    var server = require('http').Server(app);
    var bcrypt = require('bcrypt-nodejs');
    var uuid = require('uuid');
    var Game = require('./match-logic.js');
    var Api = require('./api.js');
    var questions = require('./questions.json');
    var matchEvents = require('./match-events.js');
    venti = require('./venti.min.js');
    
    var $matcher = setInterval(matcher, 1000);

    function matcher() {

        var $players = Object.keys($queue);
        var $len = Math.floor($players.length);

        if ($len < 2) {
            return false;
        }

        while($len >= 2){
            var $gameId = uuid.v4();
            var $tempQueue = [];
            for(var i = 0; i<2; i++){
                var $player = $players[i]
                $tempQueue[i] = $player;
            }
            var $game = new Game($gameId, $tempQueue[0], $tempQueue[1], Api);
            $matches[$gameId] = $game;
            $matches[$gameId]['answers'] = {};
            //console.log($queue[$tempQueue[0]]);

            $queue[$tempQueue[0]].socket.emit('matchFoundEvent', {matchId: $gameId});
            $queue[$tempQueue[1]].socket.emit('matchFoundEvent', {matchId: $gameId});

            $queue[$tempQueue[0]].socket.join($gameId);
            $queue[$tempQueue[1]].socket.join($gameId);

            delete $queue[$tempQueue[0]];
            delete $queue[$tempQueue[1]];
            $players.filter(function(val){return val});

            $players = Object.keys($queue);
            $len = Math.floor($players.length);
            console.log('Match has been made.');
            var $gameDetails = $matches[$gameId].fetchGameDetails($gameId,function($gameDetails) {
                console.log('EMITTING DATA TO CLIENTS ON '+$gameId);
                qs = getRandomQuestions(5);
                io.to($gameId).emit('requiredGameDataEvent', {playerDetails: $gameDetails.presented, gameData: $gameDetails.teams, questions: qs});
                $matches[$gameId].questions = qs;
                $matches[$gameId].gameDetails = $gameDetails;
            });
            
        }
    }

    function getRandomQuestions($amount) {
        $totalQs = Object.keys(questions).length;
        $questions = {};
        do {
            duplicate = false;
            $thisQ = Math.floor((Math.random() * $totalQs) + 1);
            Object.keys($questions).forEach(function (ele, ind, arr) {
                if (ele == $thisQ) {
                    duplicate = true;
                }
            });
            if (duplicate == false) {
                $questions[$thisQ] = questions[$thisQ];
            }

        }
        while (Object.keys($questions).length < $amount);
        return $questions;
    }

    venti.on('matchesUndefinedEvent', function(data) {
        console.log('RECEIVED AN ERROR, WILL TRY AGAIN IN 10 SECONDS');
        setTimeout(function(){
            var $gameDetails = $matches[data.match].fetchGameDetails(data.match,function($gameDetails) {
                console.log('EMITTING DATA TO CLIENTS ON '+data.match);
                qs = getRandomQuestions(5);
                io.to(data.match).emit('requiredGameDataEvent', {playerDetails: $gameDetails.presented, gameData: $gameDetails.teams, questions: qs});
                $matches[data.match].questions = qs;
                $matches[data.match].gameDetails = $gameDetails;
            });
        },1000);
    });

    function getQueueCount(){
        return {'queue':Object.keys($queue).length,'match':(Object.keys($matches).length)*2}
    }

    function checkForAllAnswerSubmissions(data,$score){
        var connectedSockets = [];
        Object.keys(io.sockets.adapter.rooms[data.gameId]).map(function(item,i){
            if(item){
                connectedSockets.push(i);
            }
        });

        $matches[data.gameId]['answers'][data.player] = $score;

        var answerAmount = parseInt(Object.keys($matches[data.gameId]['answers']).length);
        var currentSockets = parseInt(connectedSockets.length)
        if(answerAmount === currentSockets){
            console.log('ENDING THE GAME');
            $winner = 'none';
            Object.keys($matches[data.gameId]['answers']).map(function(player) {
                if ($winner == 'none') {
                    $winner = player;
                } else {
                    if ($matches[data.gameId]['answers'][player].score > $matches[data.gameId]['answers'][$winner].score) {
                        $winner = player;
                    } else if ($matches[data.gameId]['answers'][player].score == $matches[data.gameId]['answers'][$winner].score) {
                        // TIE
                        $winner = 'both';
                    }  
                }
            });
            recordGameToProfilePair(data.gameId, $winner);
            io.to(data.gameId).emit('callMatchEndEvent');
        }
    }

    function recordGameToProfilePair(id, winner) {

        Object.keys($matches[id]['answers']).map(function(key) {
            console.log(key + '--' + $won);
            Models.Profiles.findOne({loginId: key}, 'loginId totalGames gamesWon totalScore', function(err, user) {
                if (err) {
                    console.log(err);
                } else {
                    if (user == null) {
                        // Create a profile
                        console.log('Creating Profile!');
                        $profile = new Models.Profiles({loginId: key, totalGames: 1, totalScore: $matches[id]['answers'][key].score, gamesWon: (key == winner || winner == 'both')? 1:0});
                        $profile.save(function(err, profile) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log('Profile for: ' + key + ' Saved!');
                            }
                        });
                    } else {
                        // Add to a profile
                        console.log('Updating Profile!');
                        Models.Profiles.findOneAndUpdate({loginId: key}, {$set: {totalGames: user.totalGames + 1, gamesWon: user.gamesWon + (key == winner || winner == 'both')? 1:0, totalScore: user.totalScore + $matches[id]['answers'][key].score}}, function (err, user) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log('Profile for: ' + key + ' Updated!');
                            }
                        });
                    }
                }
            });
        });
        delete $matches[id];
        io.emit('requestQueueInformationEvent',{
            inQueue:getQueueCount().queue,
            inMatch:getQueueCount().match
        });
    }

    // On Global Socket Connection
    io.on('connection', function(socket)
    {

        socket.on('endGameData', function(data){
            /*
            When we receive this event we want to send back whatever is in the answers game object back to both player
            so they can interpret this information, if a player failed to submit all answers, they will get nothing.
             */
            //console.log('SCORES ON THE DOORS: ');
            //console.log($matches[data.gameId]['answers']);
            socket.emit('endGameDataEvent',{scores:$matches[data.gameId]['answers']});
        });
        
        socket.on('callMatchEnd', function(data){
            io.to(data.gameId).emit('callMatchEndEvent');
        });

        socket.on('submitAnswers', function(data){
            $score = matchEvents.parseAnswers(data, socket, $matches[data.gameId].questions, $matches);
            checkForAllAnswerSubmissions(data,$score);
        });

        socket.on('answerCount', function(data) {
            io.to(data.match).emit('answerCountEvent',{player:data.player,count:data.count});
        });

        socket.on('disconnect', function(){
            if(typeof socket.loginId !== 'undefined'){
                delete $queue[socket.loginId];
                io.to('queue-room').emit('requestQueueInformationEvent',{
                    inQueue:getQueueCount().queue,
                    inMatch:getQueueCount().match
                });
            }
        });

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
                            var $token = uuid.v4();
                            var $session = null;
                            Models.Sessions.findOne({loginId: $id}, 'loginId sessionId time', function (err, session) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    $session = session;
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
                                }
                            })

                        } else {
                            // Login Failed
                            socket.emit('loginFailedEvent', {error: 'Bad username/password combination.'});
                        }
                    }
                }
            });

        });

        socket.on('logoutRequest', function(data) {
            /*
            Ensure we remove the user from areas that they might be subscribed to in the case that they wish to logout.
             */
            if (typeof data.session == 'undefined') {
                socket.emit('authErrorEvent', {error: 'No session data.'});
            } else {
                var $res = Models.validateSession(data.session.token, data.session.loginId, function($res) {
                    /*
                     If we can successfully validate the session of the user.
                     */
                    if ($res.err) {
                        socket.emit('authErrorEvent', {error: $res.msg});
                    } else {
                        if(typeof $queue[data.session.loginId] !== 'undefined'){
                            console.log(data.session.login)
                            delete $queue[data.session.loginId];
                            io.to('queue-room').emit('requestQueueInformationEvent',{inQueue:getQueueCount().queue,inMatch:getQueueCount().match});
                        }
                    }
                });
            }
        });

        socket.on('requestUserStats', function (data) {
            /*
            When userDisplay is rendered, we want to request information about this user after validating in order to
            show specific information. In its most basic form it should be returning the summoner name and loginId, but
            eventually we'd like this to be able to send back information on stuff such as win streak, loses, total games etc.
             */
            if (typeof data.session == 'undefined') {
                socket.emit('authErrorEvent', {error: 'No session data.'});
            } else {
                var $res = Models.validateSession(data.session.token, data.session.loginId, function($res) {
                    /*
                    If we can successfully validate the session of the user.
                     */
                    if ($res.err) {
                        socket.emit('authErrorEvent', {error: $res.msg});
                    } else {
                        Models.Users.findOne({loginId: data.session.loginId}, 'loginId region summonerName password salt', function(err, user) {
                            /*
                            If we can successfully find the user in the users table.
                             */
                            if (err) {
                                socket.emit('authErrorEvent', {error: err.msg});
                            }  else {
                                if (user === null) {
                                    socket.emit('authErrorEvent', {error: 'Could not find the user to validate session off.'});
                                } else {
                                    /*
                                    Send back the data that the client side component needs.
                                     */
                                    socket.emit('userStatsEvent', {summoner:user.summonerName,loginId:user.loginId});
                                }
                            }
                        });

                    }
                });
            }
        });

        socket.on('requestQueueInformation', function(data) {
            /*
            This event is fired when a user presses the play button and the gameContent component is rendered, we want to
            request queue information when this happens so we can give the user information about who is currently in the
            queue and stuff.
            */
            socket.join('queue-room');
            io.to('queue-room').emit('requestQueueInformationEvent',{inQueue:getQueueCount().queue,inMatch:getQueueCount().match});
        });

        socket.on('requestLeaveQueueInformation', function(data) {
            /*
            If a request to leave is given, un-subscribe the user from the room that receives notifications about the queue and match sizes.
             */
            socket.leave('queue-room');
        });

        socket.on('joinQueueRequest', function(data) {
            if (typeof data.session == 'undefined') {
                socket.emit('authErrorEvent', {error: 'No session data.'});
            } else {
                var $res = Models.validateSession(data.session.token, data.session.loginId, function($res) {
                    /*
                     If we can successfully validate the session of the user.
                     */
                    if ($res.err) {
                        socket.emit('authErrorEvent', {error: $res.msg});
                    } else {
                        $queue[data.session.loginId] = {id: data.session.loginId, token: data.session.token, socket: socket};
                        io.to('queue-room').emit('requestQueueInformationEvent',{inQueue:getQueueCount().queue,inMatch:getQueueCount().match});
                        socket.loginId = data.session.loginId;
                        socket.emit('joinQueueRequestEvent',{inQueue:true});
                    }
                });
            }
        });

        socket.on('leaveQueueRequest', function(data) {
            if (typeof data.session == 'undefined') {
                socket.emit('authErrorEvent', {error: 'No session data.'});
            } else {
                var $res = Models.validateSession(data.session.token, data.session.loginId, function($res) {
                    /*
                     If we can successfully validate the session of the user.
                     */
                    if ($res.err) {
                        socket.emit('authErrorEvent', {error: $res.msg});
                    } else {
                        if(typeof $queue[data.session.loginId] !== 'undefined'){
                            delete $queue[data.session.loginId];
                        }
                        io.to('queue-room').emit('requestQueueInformationEvent',{inQueue:getQueueCount().queue,inMatch:getQueueCount().match});
                        socket.emit('leaveQueueRequestEvent',{inQueue:false});
                    }
                });
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


