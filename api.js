/**
 * Created by Tom on 23/04/2016.
 * A simple interface for making api calls.
 */


var api = module.exports = {};

    api.endpoint = require('./rito-endpoint');
	api.matchLogic = require('./match-logic');
    venti = require('./venti.min.js');


	var $masteryResp = [];
	venti.on('gotMasteryData', function(data) {

		$masteryResp.push(data.reObj);

		if ($masteryResp.length == 5) {
			if (data.teamColour == 'red') {
				data.gameData.presented.teams.red = $masteryResp;
			} else {
				data.gameData.presented.teams.blue = $masteryResp;
			}
			data.callback(data.gameData);
			$masteryResp = [];
		}

	});

	api.getMatch = function ($gameId, $region, $id, $callback) {
        var $match = api.endpoint.league.challenger({
            type: 'RANKED_SOLO_5x5'
        }, function($response){
        	// console.log($response);
        	if (typeof $response.entries == "undefined") {
        		console.log('A FAILURE HAS OCCOURED (1)');
        		venti.trigger('matchesUndefinedEvent', {match:$gameId, region: $region, id: $id});
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
	            		console.log('A FAILURE HAS OCCOURED (2)');
	            		venti.trigger('matchesUndefinedEvent', {match:$gameId, region: $region, id: $id});
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
		                // console.log($match);
		                $match = api.populateMatch($match, function($match) {
		                	//console.log($match.presented.teams.red[0]);
		                	$callback($match);
		                });
	            	}

	            });

        	}

        });
	},

	api.populateMatch = function($match, callback) {
		// Populate the match object with relevant information to the game
		//teamId is red
		var $popMatch = api.endpoint.getMatchData($match, function($response) {
			// console.log($response);
			// console.log($response.participants[1].stats);
			var $gameData = {};
			var $red = [];
			var $blue = [];
			var $mastery = null;
			var idObj = $response.participantIdentities.reduce(function(o, v, i) {
			  o[i] = v;
			  return o;
			}, {});
			$gameData.playerStats = {};
			$response.participants.forEach(function(element, index, array) {
				pId = element.participantId - 1;
				$pObj = idObj[pId];
				if (element.teamId == 100) {
					$red.push({playerObj: element,
						champion: element.championId,
						team: 'red',
						rankedBest: element.highestAchievedSeasonTier,
						timeline: element.timeline,
						mastery: $mastery,
						pId: element.participantId,
						playerName: $pObj.player.summonerName
					});
				} else if (element.teamId == 200) {
					$blue.push({playerObj: element,
						champion: element.championId,
						team: 'red',
						rankedBest: element.highestAchievedSeasonTier,
						timeline: element.timeline,
						mastery: $mastery,
						pId: element.participantId,
						playerName: $pObj.player.summonerName
					});
				}
				$gameData.playerStats[element.participantId] = element.stats;
			});
			$gameData.presented = {};
			$gameData.presented.teams = {red: $red, blue: $blue};
			api.getPlayerInfo($gameData.presented.teams.red, 'red', $response.participantIdentities, $gameData, function(data) {
				$gameData = data;
				setTimeout(api.getPlayerInfo, 10000, $gameData.presented.teams.blue, 'blue', $response.participantIdentities, $gameData, function(data) {
					$gameData = data;
					$gameData.teams = {red: null, blue: null};
					$response.teams.forEach(function (ele, ind, arr) {
						if (ele.teamId == 100) {
							$gameData.teams.red = ele;
						} else if (ele.teamId == 200) {
							$gameData.teams.blue = ele;
						}
						if ($gameData.teams.red != null && $gameData.teams.blue != null) {
							callback($gameData);
						}
					});

				})
			});


		});
		

	}

	api.getPlayerInfo = function ($team, $teamColour, $participants, $gameData, callback) {

		//Passing a team array in adds mastery property, do one team and then wait 10, or else you risk a blacklisting
		$team.forEach(function(obj) {
			$pIdNo = obj.playerObj.participantId;
			var $returnObj = obj;
			$returnObj = $participants.map(function(elem, ind, arr) {
				if (elem.participantId == $pIdNo) {
					var $returningObject = api.endpoint.getMasteryRatingByPlayerChampIds(elem.player.summonerId, obj.playerObj.championId, function($resp) {

						if ($resp.statusCode == 204) {
							returnObj.mastery = 0;
							venti.trigger('gotMasteryData', {teamcolour: $teamColour, reObj: returnObj, callback: callback, gameData: $gameData});
						} else {
							returnObj = obj;
							returnObj.mastery = $resp.championLevel;
							venti.trigger('gotMasteryData', {teamcolour: $teamColour, reObj: returnObj, callback: callback, gameData: $gameData});

						}
					});
				}
			});
		});
	} 

	/*
	For Questions
assists
champLevel
deaths
goldEarned
goldSpent
kills
largestCriticalStrike
largestKillingSpree
minionsKilled
physicalDamageDealtToChampions
totalDamageDealtToChampions
totalDamageTaken
totalHeal
wardsPlaced
wardsKilled
towerKills
totalTImeCrowdControlDelt
firstBlood
firstTowerKill
	*/