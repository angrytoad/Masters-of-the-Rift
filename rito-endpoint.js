



var endpoint = module.exports = {};
    
    endpoint.key = require('./api-key');
    endpoint.https = require('https');

    endpoint.settings = {
        protocol: 'https',
        region: 'euw'
    };



    /*
    For the most part you should be alright to copy-paste these functions and only need to tweak the endpoint string to
    what you need, everything else is pretty much the same, there isn't any error handling in at the moment so that
    will need to be added at some point, maybe a stretch goal ROFL :D
     */
    endpoint.league = {
        /*
        Contains all functions related to the league endpoint with league of legends
         */
        challenger: function($options,$callback){
            return endpoint.https.get(
                endpoint.settings.protocol+'://'+endpoint.settings.region+'.api.pvp.net/api/lol/'+endpoint.settings.region+'/v2.5/league/challenger/?type='+$options.type+'&api_key='+endpoint.key,
                function(response) {
                    // Continuously update stream with data
                    var body = '';
                    response.on('data', function(d) {
                        body += d;
                    });
                    response.on('end', function() {
                        var parsed = JSON.parse(body);
                        $callback(parsed);
                    });
                }
            );
        }
    };

    endpoint.matchList = function($options,$callback){
        /*
        Fetch a match list for SOLO RANKED in SEASON 2016 for the given Summoner ID
         */
        return endpoint.https.get(
            endpoint.settings.protocol+'://'+endpoint.settings.region+'.api.pvp.net/api/lol/'+endpoint.settings.region+'/v2.2/matchlist/by-summoner/'+$options.id+'?api_key='+endpoint.key,
            function(response) {
                // Continuously update stream with data
                var body = '';
                response.on('data', function(d) {
                    body += d;
                });
                response.on('end', function() {
                    var parsed = JSON.parse(body);
                    $callback(parsed);
                });
            }
        )
    }

    endpoint.getMatchData = function($match, $callback) {

    	//Takes a match id and returns the teams
    	endpoint.https.get(
    		endpoint.settings.protocol+'://'+endpoint.settings.region+'.api.pvp.net/api/lol/'+endpoint.settings.region+'/v2.2/match/'+$match.matchId+'?includeTimeline=true&api_key='+endpoint.key,
    		function(response) {
    			//Update Datastream
    			var body = '';
                response.on('data', function(d) {
                    body += d;
                });
                response.on('end', function() {
                    var parsed = JSON.parse(body);
                    $callback(parsed);
                });
    		}
    	);

    }

    endpoint.getMasteryRatingByPlayerChampIds = function($playerId, $champId, $callback) {

    	endpoint.https.get(
    		endpoint.settings.protocol+'://'+endpoint.settings.region+'.api.pvp.net/championmastery/location/'+endpoint.settings.region+'1/player/'+$playerId+'/champion/'+$champId+'?api_key='+endpoint.key,
    		function(response) {

                console.log('STATUS CODE: '+response.statusCode);
                if(response.statusCode === 204){
                    console.log('NO MASTERY FOUND')
                    $re = $callback({championLevel:0});
                }else{
                    //Update Datastream
                    var body = '';
                    response.on('data', function(d) {
                        body += d;
                    });
                    response.on('end', function() {
                        var parsed = JSON.parse(body);
                        $re = $callback(parsed);
                    });
                }

    		}
    	);	
    }

    endpoint.getChampionObjectFromId = function($champId, $callback)  {

    	endpoint.https.get(
    		endpoint.settings.protocol+'://'+endpoint.settings.region+'.api.pvp.net/api/lol'+endpoint.settings.region+'/v1.2/champion/'+$champId+'?api_key='+endpoint.key,
    		function(response) {
    			//Update Datastream
    			var body = '';
                response.on('data', function(d) {
                    body += d;
                });
                response.on('end', function() {
                    var parsed = JSON.parse(body);
                    $re = $callback(parsed);
                });
    		}
    	);	

    }
