/**
 * Created by Tom on 23/04/2016.
 * A simple interface for making api calls.
 */


var api = module.exports = {};

    api.endpoint = require('./rito-endpoint');
    venti = require('./venti.min.js');

	venti.on('matchesUndefinedEvent', function(data) {
		api.getMatch(data.region, data.id);
	});

	api.getMatch = function ($region, $id) {
        var $match = api.endpoint.league.challenger({
            type: 'RANKED_SOLO_5x5'
        }, function($response){
        	console.log($response);
        	if (typeof $response.entries == "undefined") {
        		venti.trigger('matchesUndefinedEvent', {region: $region, id: $id});
        	} else {

	            var $league = $response.entries;
	            var $player = $league[Math.floor(Math.random() * ($league.length - 0 + 1))];
	            /*
	            AT THE MOMENT $player THIS WILL GIVE YOU A RANDOM PLAYER FROM CHALLENGER LEAGUE.
	             */
	            var $matchList = api.endpoint.matchList({
	                id:$player.playerOrTeamId
	            },function($response){
	            	// console.log($player);
	            	// console.log($response);
	            	// console.log($response.matches);
	            	if (typeof $response.matches == "undefined") {
	            		venti.trigger('matchesUndefinedEvent', {region: $region, id: $id});
	            	} else {
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
		                //console.log($match);
		                //$match = api.populateMatch($match);
	            	}

	            });

        	}

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
					$red.push({playerObj: element, champion: element.championId, team: 'red', rankedBest: element.highestAchievedSeasonTeir, timeline: element.timeline, mastery: $mastery});
				} else if (element.teamId == 200) {
					$blue.push({playerObj: element, champion: element.championId, team: 'blue', rankedBest: element.highestAchievedSeasonTeir, timeline: element.timeline, mastery: $mastery});
				}
			});
			$gameData.presented = {};
			$gameData.presented.teams = {red: $red, blue: $blue};
			api.getPlayerInfo($gameData.presented.teams.red, 'red', $response.participantIdentities, $gameData, function(data) {
				$gameData = data;
				setTimeout(api.getPlayerInfo, 10000, $gameData.presented.teams.blue, 'blue', $response.participantIdentities, $gameData, function(data) {
					$gameData = data;
					console.log('ERMAGERD');
					console.log($gameData.presented.teams.red);

				})
			});


		});
		

	}

	api.getPlayerInfo = function ($team, $teamColour, $participants, $gameData, callback) {

		//Passing a team array in adds mastery property, do one team and then wait 10, or else you risk a blacklisting

		$newTeam = $team.map(function(obj, ind) {
			$pIdNo = obj.playerObj.participantId;
			var $returnObj = obj;
			$returnObj = $participants.map(function(elem, ind, arr) {
				if (elem.participantId == $pIdNo) {
          
					var $returningObject = api.endpoint.getMasteryRatingByPlayerChampIds(elem.player.summonerId, obj.playerObj.championId, function($resp) {
						if ($resp.statusCode == 204) {
							returnObj.mastery = 0;
						} else {
							returnObj = obj;
							returnObj.mastery = $resp.championLevel;
						}
           			return returnObj; // In here got it
					});
					return $returningObject // Then pass it back to .map()
				}
			});
			return $returnObj[ind]; // Then pass your $returnObj (from $participants.map) back up to the $team.map function
		});
		if ($teamColour == 'red') {
			$gameData.presented.teams.red = $newTeam;
		} else {
			$gameData.presented.teams.blue = $newTeam;
		}
		callback($gameData);
	} 