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
        	//console.log($response);
            var $league = $response.entries;
            var $player = $league[Math.floor(Math.random() * ($league.length - 0 + 1))];

            /*
            AT THE MOMENT $player THIS WILL GIVE YOU A RANDOM PLAYER FROM CHALLENGER LEAGUE.
             */
            var $matchList = api.endpoint.matchList({
                id:$player.playerOrTeamId
            },function($response){
            	//console.log($response.matches);
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
                $match = api.populateMatch($match);

            });
        });
	},

	api.populateMatch = function($match) {
		// Populate the match object with relevant information to the game
		var $popMatch = api.endpoint.getMatchData($match, function($response) {
			console.log($response);
			var $gameData = {};
			var $red = [];
			var $blue = [];
			var $mastery = null;
			$response.participants.forEach(function(element, index, array) {
				if (element.teamId == 100) {
					$pIdNo = element.participantId;
					$response.participantIdentities.forEach(function(elem, ind, arr) {
						if (elem.participantId == $pIdNo) {
							console.log(element);
							// api.endpoint.getMasteryRatingByPlayerChampIds(elem.player.playerId, element.championId, function($resp) {  // Commented out mastery getting since its individual to champs it causes rate exceeds and risks blacklisting, also fails somewhere
							// 	if ($resp.statusCode == 204) {
							// 		$mastery = 0;
							// 	} else {
							// 		$mastery = $resp.championLevel;
							// 	}
							// });
						}
					});
					$red.push({playerObj: element, champion: element.championId, team: 'red', rankedBest: element.highestAchievedSeasonTeir, timeline: element.timeline, mastery: $mastery});
				} else if (element.teamId == 200) {
					$pIdNo = element.participantId;
					$response.participantIdentities.forEach(function(elem, ind, arr) {
						if (elem.participantId == $pIdNo) {
							console.log(element);
							// api.endpoint.getMasteryRatingByPlayerChampIds(elem.player.playerId, element.championId, function($resp) {
							// 	if ($resp.statusCode == 204) {
							// 		$mastery = 0;
							// 	} else {
							// 		$mastery = $resp.championLevel;
							// 	}
							// });
						}
					});
					$blue.push({playerObj: element, champion: element.championId, team: 'blue', rankedBest: element.highestAchievedSeasonTeir, timeline: element.timeline, mastery: $mastery});
				}
			});
			$gameData.presented = {};
			$gameData.presented.teams = {red: $red, blue: $blue};

		});
		

	}

	api.getPlayerInfo = function ($match) {

	}
