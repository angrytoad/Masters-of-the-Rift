/**
 * Created by Tom on 23/04/2016.
 * A simple interface for making api calls.
 */


var api = module.exports = {};

    api.endpoint = require('./rito-endpoint');

	api.getMatch = function ($region, $id) {
        var $match = api.endpoint.league.challenger({
            type: 'RANKED_SOLO_5x5'
        }, function($response){
            var $league = $response.entries;
            var $player = $league[Math.floor(Math.random() * ($league.length - 0 + 1))];

            /*
            AT THE MOMENT $player THIS WILL GIVE YOU A RANDOM PLAYER FROM CHALLENGER LEAGUE.
             */
            var $matchList = api.endpoint.matchList({
                id:$player.playerOrTeamId
            },function($response){
                var $matchList = $response.matches;
                /*
                AT THIS POINT $matchList SHOULD CONTAIN A NUMBER OF GAMES FROM THE PLAYER THAT ARE RANKED SOLO QUEUE AND
                HAVE BEEN PLAYED IN THE 2016 SEASON
                 */
                var $match = $matchList[Math.floor(Math.random() * ($matchList.length + 1))]; // Get a random match from the ones returned.

                /*
                This should allow us to grab the match ID and start returning some actual match information. Needs building
                still in the rito-endpoint
                 */
                console.log($match);
            });
        });
	},

	api.getPlayerInfo = function ($match) {

	}
