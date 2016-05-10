/*
 This is the queue object and contains all people who are currently in the queue.
 */
var $queue = {};

/*
 This is the matches object and contains all matches which are currently being played.
 */
var $matches = {};

module.exports = function(io, Models) {

    /*
    *   Setup of access to logic in other files/modules
    */

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

    // Counts return connections from ending games
    var $dataSent = 0;


    venti.on('endGameDataSent', function(data) {

        /*
        *   custom event to trigger on the end of a game pair, only triggers when both clients have returned their data
        *   @param data - a data object containing the gameId of the ending game
        *
        *   desc - Triggers on the end game event sent by the client, once both clients have sent this data the function deletes this game
        *   from the games object and sent out an update event to the relevant queues, and leaderboard stats
        */

        $dataSent++;
        if ($dataSent == 2) {
            delete $matches[data.data.gameId];
            io.emit('requestQueueInformationEvent',{
                inQueue:getQueueCount().queue,
                inMatch:getQueueCount().match
            });
            $dataSent = 0;
            Models.Profiles.find({}, 'loginId totalGames gamesWon totalScore', {skip:0, limit:25, sort:{totalScore:-1}}, function(err, profiles) {
                io.emit('requestLeaderboardStatsEvent', {leaders: profiles});
            });
        }
    });

    // Inititalise matches every second
    var $matcher = setInterval(matcher, 1000);

    function matcher() {

        /*
        *   class @matcher
        *
        *   desc - A function for matching clients into games in pairs.  Runs on an interval every second to check if there is clients that can be matched.
        *   Pairs clients in connection order and then creates a game in the games object relating to them, and stored the relevant information.
        *   Also initialises the game object with fresh questions and then moves socket connections to a room under the generated gameId.
        *   Finally removed users from the queue object and repeats until the number of users in the queue is less than 2.
        */

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


            $queue[$tempQueue[0]].socket.emit('matchFoundEvent', {matchId: $gameId});
            $queue[$tempQueue[1]].socket.emit('matchFoundEvent', {matchId: $gameId});

            $queue[$tempQueue[0]].socket.join($gameId);
            $queue[$tempQueue[1]].socket.join($gameId);

            delete $queue[$tempQueue[0]];
            delete $queue[$tempQueue[1]];
            $players.filter(function(val){return val});

            $players = Object.keys($queue);
            $len = Math.floor($players.length);
            var $gameDetails = $matches[$gameId].fetchGameDetails($gameId,function($gameDetails) {
                console.log('EMITTING DATA TO CLIENTS ON '+$gameId);
                qs = getRandomQuestions(5);
                io.to($gameId).emit('requiredGameDataEvent', {playerDetails: $gameDetails.presented, gameData: $gameDetails.teams, questions: qs});
                $matches[$gameId].questions = qs;
                $matches[$gameId].gameDetails = $gameDetails;
                setTimeout(gcMatch, 150000, $gameId);
                io.to('queue-room').emit('requestQueueInformationEvent',{
                    inQueue:getQueueCount().queue,
                    inMatch:getQueueCount().match
                });
            });
            
        }
    }

    function gcMatch($id) {
        /*
        *   class @gcMatch
        *
        *   @param $id the match id
        *
        *   desc - Removes matches after they should have ended
        */
        if (typeof $matches[$id] !== "undefined") {
            delete $matches[$id];
            io.to('queue-room').emit('requestQueueInformationEvent',{
                inQueue:getQueueCount().queue,
                inMatch:getQueueCount().match
            });
        }
    }

    function getRandomQuestions($amount) {

        /*
        *   class @getRandomQuestions
        *
        *   @param $amount - The amount of questions to return
        *
        *   desc - A function that gets a number of random unique questions from the questions object (read in from a separate json) in order to facilitate a match
        */

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

        /*
        *   custom event code to trigger if the api call return a summoner with no matches
        *   @param data - a data object containing match data used to select a game to base the match on
        * 
        *   desc - Makes another attempt to initialise the game after logging the error in the node console
        *   If the game is sucessfully initialised in the call to fetchGameDetails send the start match event out the clients with the relevant data to render the match
        */

        console.log('RECEIVED AN ERROR, WILL TRY AGAIN IN 10 SECONDS');
        setTimeout(function(){
            var $gameDetails = $matches[data.match].fetchGameDetails(data.match,function($gameDetails) {
                qs = getRandomQuestions(5);
                io.to(data.match).emit('requiredGameDataEvent', {playerDetails: $gameDetails.presented, gameData: $gameDetails.teams, questions: qs});
                $matches[data.match].questions = qs;
                $matches[data.match].gameDetails = $gameDetails;
            });
        },1000);
    });

    function getQueueCount(){

        /*
        *   class @getQueueCount
        *   
        *   desc - returns the number of clients connected and in the queue object
        */

        return {'queue':Object.keys($queue).length,'match':(Object.keys($matches).length)*2}
    }

    function checkForAllAnswerSubmissions(data,$score){

        /*
        *   class @checkForAllAnswerSubmissions
        *
        *   @param data - a data object containing the gameId
        *   @param $score - the clients score
        *
        *   desc - Function that checks whether both clients have submitted their answers and will allow quick ending of the game if one client has disconnected
        *   If both clients are done calls logic to determin the winner and update the relevant user profiles
        */

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
            $winner = 'none';
            Object.keys($matches[data.gameId]['answers']).map(function(player) {
                if ($winner == 'none') {
                    $winner = player;
                } else {
                    if ($matches[data.gameId]['answers'][player].score > $matches[data.gameId]['answers'][$winner].score) {
                        $winner = player;
                    } else if ($matches[data.gameId]['answers'][player].score == $matches[data.gameId]['answers'][$winner].score) {
                        $winner = 'both';
                    }  
                }
            });
            io.to(data.gameId).emit('callMatchEndEvent');
            recordGameToProfilePair(data.gameId, $winner);
        }
    }

    function recordGameToProfilePair(id, winner) {

        /*
        *   class @recordGameToProfilePair
        *
        *   @param id - the game's id
        *   @param winner - the loginID of the client with the highest score, if scores are equal contains 'both' as they both won.
        *
        *   desc - A function for adding the game's scores to each players profile in the profiles collection in mongodb, if the user has no profile in the collection the
        *   code will create one using this games stats.  This is relevant for the users first game as the profile is not created on registration.
        *   All data in the profiles collection can be used to work out the users stats such as win ratios and avarage points scored.
        */

        Object.keys($matches[id]['answers']).map(function(key) {
            Models.Profiles.findOne({loginId: key}, 'loginId totalGames gamesWon totalScore', function(err, user) {
                if (err) {
                    console.log(err);
                } else {
                    if (user == null) {
                        var increment = 0;
                        if(key == winner || winner == 'both'){
                            increment = 1;
                        }

                        $profile = new Models.Profiles({loginId: key, totalGames: 1, totalScore: $matches[id]['answers'][key].score, gamesWon: increment});
                        $profile.save(function(err, profile) {
                            if (err) {
                                console.log(err);
                            }
                        });
                    } else {
                        var increment = 0;
                        if(key == winner || winner == 'both'){
                            increment = 1;
                        }
                        Models.Profiles.findOneAndUpdate({loginId: key}, {$set: {totalGames: user.totalGames + 1, gamesWon: user.gamesWon + increment, totalScore: user.totalScore + $matches[id]['answers'][key].score}}, function (err, user) {
                            if (err) {
                                console.log(err);
                            }
                        });
                    }
                }
            });
        });
    }

    // On Global Socket Connection
    io.on('connection', function(socket)
    {

        /*
        *   class anonFunc
        *
        *   @param socket - the socket connection
        *
        *   desc - A function for handling various events sent by the clients in order to interact with the server
        *   separated into separate events that the server is listening for
        */

        socket.on('requestLeaderboardStats', function(data) {

            /*
            *   Event listener for updating a clients leaderboard stats
            *
            *   desc - Simply returns the top 25 players by totalScore from the profiles collection in the database
            */

            Models.Profiles.find({}, 'loginId totalGames gamesWon totalScore', {skip:0, limit:25, sort:{totalScore:-1}}, function(err, profiles) {
                socket.emit('requestLeaderboardStatsEvent', {leaders: profiles});
            });
        });

        socket.on('endGameData', function(data){
            /*
            When we receive this event we want to send back whatever is in the answers game object back to both player
            so they can interpret this information, if a player failed to submit all answers, they will get nothing.
             */
            socket.emit('endGameDataEvent',{scores:$matches[data.gameId]['answers']});
            venti.trigger('endGameDataSent', {data: data});
        });
        
        socket.on('callMatchEnd', function(data){
            /*
            *   Event for clients to inform the server that they have finished the game, server returns an event to the game room to render end components
            */
            io.to(data.gameId).emit('callMatchEndEvent');
        });

        socket.on('submitAnswers', function(data){

            /*
            *   Event listener for the submit answers event from clients
            *
            *   @param data - A data object containing the game Id
            *
            *   desc - Function check if both clients have sumbitted their answers after calling the parseScore function to assess the clients answers and assign them a score
            */
            $score = matchEvents.parseAnswers(data, socket, $matches[data.gameId].questions, $matches);
            checkForAllAnswerSubmissions(data,$score);
        });

        socket.on('answerCount', function(data) {

            /*
            *   Event listener for when clients answer questions
            *
            *   @param data - a data object containing the id of the player that sent the event and how many questions they have answered
            *
            *   desc - allows player to see how many questions their opponent has seen in real time
            */

            io.to(data.match).emit('answerCountEvent',{player:data.player,count:data.count});
        });

        socket.on('disconnect', function(){

            /*
            *   Event listener for disconnect events from clients
            *
            *   desc - Allows the server to disconnect the client from the game queue if they are in it and update the stats for the queue room
            */

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



        socket.on('loginRequest', function(data) {

            /*
            *   Event listener for login requests
            *
            *   @param data.login.region - the region for their account, forms part of their login id
            *   @param data.login.summoner - the users summoner name, forms the latter part of their summoner Id
            *   @param data.login.password - the users password
            *
            *   desc - A function to be triggered on a request to login event.  Firstly creates the users loginID out of their region and summonerName and uses it to retrieve that user from the database.
            *   If the user is not found in the database, returns the user not found event back to the client.  If the user exists, the given password is combined with the salt in the database and compared to the hash in the database
            *   If the hashes match the user is logged in and recieves the appropriate event as well as setting/updating their token and session data in the sessions collection.
            *   If the hashes do not match a relevant error is returned to the client.
            */

            console.log('Checking if user is in DB!');
            var $dbUser = null;
            $id = data.login.region + '-' + data.login.summoner;
            Models.Users.findOne({loginId: $id}, 'loginId region summonerName password salt', function(err, user) {
                if (err) {
                    socket.emit('loginErrorEvent', {error: err});
                }  else {
                    $dbUser = user;
                    if ($dbUser === null) {
                        socket.emit('noUserFoundEvent', {});
                    } else {
                        // Attempt login / password auth
                        $hash = bcrypt.hashSync(data.login.password, $dbUser.salt);
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
            *   Event listener for logout requests
            *   
            *   @param data - a data object containing the id of the user sending the logout event, as well as their token
            *
            *   desc - Function logs out users and destroys their sessions in the sessions collection
            *   Also removes the user from the game queue if they are in it
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
                            delete $queue[data.session.loginId];
                            io.to('queue-room').emit('requestQueueInformationEvent',{inQueue:getQueueCount().queue,inMatch:getQueueCount().match});
                        }
                    }
                });
            }
        });

        socket.on('requestUserStats', function (data) {
            /*
            *   Event listener for requests for a users stats to display on the page
            *
            *   @param data - a data object containing user information used to validate their session
            *
            *   desc - When userDisplay is rendered, we want to request information about this user after validating in order to
            *   show specific information. In its most basic form it should be returning the summoner name and loginId, but
            *   eventually we'd like this to be able to send back information on stuff such as win streak, loses, total games etc.
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
                                    Models.Profiles.findOne({loginId: data.session.loginId}, 'totalGames totalScore gamesWon', function(err, profile) {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            // If profile is found add relevant user stats to the return object
                                            if (profile == null) {
                                                socket.emit('userStatsEvent', {summoner:user.summonerName, loginId:user.loginId, stats:{totalGames: 0, totalScore: 0, gamesWon: 0}});
                                            } else {
                                                socket.emit('userStatsEvent', {summoner:user.summonerName, loginId:user.loginId, stats:{totalGames: profile.totalGames, totalScore: profile.totalScore, gamesWon: profile.gamesWon}});
                                            }
                                        }
                                    });
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

            /*
            *   Event listener for clients wanting to join the game queue
            *
            *   @param data - contains userdata to validate the users session
            *
            *   desc - Allows users to join a queue to be matched into competetive games and then updates the queue listings for all clients
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
                        $queue[data.session.loginId] = {id: data.session.loginId, token: data.session.token, socket: socket};
                        io.to('queue-room').emit('requestQueueInformationEvent',{inQueue:getQueueCount().queue,inMatch:getQueueCount().match});
                        socket.loginId = data.session.loginId;
                        socket.emit('joinQueueRequestEvent',{inQueue:true});
                    }
                });
            }
        });

        socket.on('leaveQueueRequest', function(data) {

            /*
            *   Event listener for clients attempting to leave the queue
            *
            *   @param data - contains user data to validate their session
            *
            *   desc - Function removes the user from the queue and updates the other clients to the correct number
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
                            delete $queue[data.session.loginId];
                        }
                        io.to('queue-room').emit('requestQueueInformationEvent',{inQueue:getQueueCount().queue,inMatch:getQueueCount().match});
                        socket.emit('leaveQueueRequestEvent',{inQueue:false});
                    }
                });
            }
        });

        socket.on('registerRequest', function(data) {

            /*
            *   Event listener for users attempting to register accounts
            *
            *   @param data.login.region - The users selected region
            *   @param data.login.summoner - The users selected summoner name
            *   @param data.login.password - the users desired password
            *
            *   desc - Function to handle requests to register to the site, firstly checks to see if a user with the same region/name combo exists by concatenating them into a loginId
            *   if the user does not exist, creates a new user document for the database using the supplied information.  Generates a salt for the user and hashes the supplied password with this salt for storage and authentication
            */

            var $dbUser = null;
            $id = data.login.region + '-' + data.login.summoner;
            Models.Users.findOne({loginId: $id}, 'loginId region summonerName password salt', function(err, user) {
                if (err) {
                    socket.emit(loginErrorEvent, {error: err});
                }  else {
                    $dbUser = user;
                    if ($dbUser === null) {
                        // User does not already exist
                        $loginId = data.login.region + '-' + data.login.summoner;
                        $salt = bcrypt.genSaltSync(10);
                        $hash = bcrypt.hashSync(data.login.password, $salt);
                        var $newUser = new Models.Users({loginId: $loginId, summonerName: data.login.summoner, region: data.login.region, password: $hash, salt: $salt});
                        $newUser.save(function (err, $newUser) {
                            if (err) {
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

    });

}


