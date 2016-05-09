/**
 * Created by Tom on 23/04/2016.
 * A simple interface for making api calls.
 */


var api = module.exports = {};

	// Include the endpoint file for making requests to the riot api

	api.endpoint = require('./rito-endpoint');

	// Init required jsons of items, spells and champions to give context to returned data, ids cannot be used to get images and other data

	api.matchLogic = require('./match-logic');
	api.champions = require('./champions.json');
	api.items = require('./items.json');
	api.spells = require('./spells.json');
    venti = require('./venti.min.js');

	var $masteryResp = [];
	venti.on('gotMasteryData', function(data) {

		/*
		*	Custom event code to be ran after mastery data has been aquired
		*	
		*	Once data for all participants has been aquired return that team data back using the supplied callback function
		*/

		$masteryResp.push(data.reObj);

		if ($masteryResp.length == 5) {
			if (data.teamColour == 'red') {
				data.gameData.presented.teams.red = $masteryResp;
			} else if (data.teamColour == 'blue') {
				data.gameData.presented.teams.blue = $masteryResp;
			}
			data.callback(data.gameData);
			$masteryResp = [];
		}

	});

	api.getMatch = function ($gameId, $region, $id, $callback) {

		/*
		*	class @getMatch
		*
		*	@param $gameId - The id of the game in the matches object
		*	@param $region - The server region to request the data from
		*	@param $id - The id of the game to request from the match api
		*	@param $callback - A callback function to return the reponse
		*
		*	desc - This function gets a random challanger ranked player and selected a random game from their match history before populating the game object with relevant mastery and other information
		*	
		*/

        var $match = api.endpoint.league.challenger({
            type: 'RANKED_SOLO_5x5'
        }, function($response){
        	if (typeof $response.entries == "undefined") {
        		venti.trigger('matchesUndefinedEvent', {match:$gameId, region: $region, id: $id});
        	} else {

	            var $league = $response.entries;
	            var $player = $league[Math.floor(Math.random() * ($league.length - 0 + 1))];
	            /*
	            AT THE MOMENT $player THIS WILL GIVE YOU A RANDOM PLAYER.
	             */
				if(typeof $player.playerOrTeamName == 'undefined'){
					venti.trigger('matchesUndefinedEvent', {match:$gameId, region: $region, id: $id});
				}else{
					var $matchList = api.endpoint.matchList({
						id:$player.playerOrTeamId
					},function($response){
						if (typeof $response.matches == "undefined") {;
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
							$match = api.populateMatch($gameId, $match, function($match) {
								$callback($match);
							});
						}

					});
				}
        	}

        });
	},

	api.populateMatch = function($gameId, $match, callback) {

		/*
		*	class @populateMatch
		*
		*	@param $gameId - the id of the game in the matches object
		*	@param $match - the id of the selected matchdata to get back from the riot api
		*	@callback - callback function for returning the data
		*
		*	desc - A function that gets match data from the requested Id and separates it into displayable data for the game event and general data to be used in determining the answer.
		*	Attempts to used json objects to replace ids for summoner spells, items and champions with the associated object or name.  This is so the front end can display content correctly
		*	The function also loops over the participants of the match to make separate calls to add their mastery with that champion to the data available
		*/

		var $popMatch = api.endpoint.getMatchData($match, function($response) {
			var $gameData = {};
			var $red = [];
			var $blue = [];
			var $champs = [];
			var $spells = [];
			var $items = [];
			var $mastery = null;
            if (typeof $response.matchId == "undefined") {
                venti.trigger('matchesUndefinedEvent', {match:$gameId});
            }else{
                var idObj = $response.participantIdentities.reduce(function(o, v, i) {
                  o[i] = v;
                  return o;
                }, {});
                $gameData.playerStats = {};
                $response.participants.forEach(function(element, index, array) {
                    pId = element.participantId - 1;
                    $pObj = idObj[pId];
                    $champName = null;
                    Object.keys(api.champions.data).map(function(value, index) {
                    	if (api.champions.data[value].key == element.championId) {
                    		$champName = value;
                    	}
                    });
                    if (element.teamId == 100) {
                        $red.push({playerObj: element,
                            champion: $champName,
                            team: 'red',
                            rankedBest: element.highestAchievedSeasonTier,
                            timeline: element.timeline,
                            mastery: $mastery,
                            pId: element.participantId,
                            playerName: $pObj.player.summonerName
                        });
                    } else if (element.teamId == 200) {
                        $blue.push({playerObj: element,
                            champion: $champName,
                            team: 'blue',
                            rankedBest: element.highestAchievedSeasonTier,
                            timeline: element.timeline,
                            mastery: $mastery,
                            pId: element.participantId,
                            playerName: $pObj.player.summonerName
                        });
                    }
                    $gameData.playerStats[element.participantId] = element.stats;
                });
                Object.keys($gameData.playerStats).forEach(function (ele, ind, arr) {
                	$gameData.playerStats[ele].item0 = api.items.data[$gameData.playerStats[ele].item0];
                	$gameData.playerStats[ele].item1 = api.items.data[$gameData.playerStats[ele].item1];
                	$gameData.playerStats[ele].item2 = api.items.data[$gameData.playerStats[ele].item2];
                	$gameData.playerStats[ele].item3 = api.items.data[$gameData.playerStats[ele].item3];
                	$gameData.playerStats[ele].item4 = api.items.data[$gameData.playerStats[ele].item4];
                	$gameData.playerStats[ele].item5 = api.items.data[$gameData.playerStats[ele].item5];
                	$gameData.playerStats[ele].item6 = api.items.data[$gameData.playerStats[ele].item6];
                });
                $gameData.presented = {};
                $gameData.presented.teams = {red: $red, blue: $blue};
                api.getPlayerInfo($gameData.presented.teams.red, 'red', $response.participantIdentities, $gameData, function(data) {
                    $gameData = data;
                    setTimeout(api.getPlayerInfo, 500, $gameData.presented.teams.blue, 'blue', $response.participantIdentities, $gameData, function(data) {
                        $gameData = data;
                        $gameData.teams = {red: null, blue: null};
                        $response.teams.forEach(function (ele, ind, arr) {
                            if (ele.teamId == 100) {
                                $gameData.teams.red = ele;
                            } else if (ele.teamId == 200) {
                                $gameData.teams.blue = ele;
                            }
                            if ($gameData.teams.red != null && $gameData.teams.blue != null) {
                            	if ($gameData.teams.red.hasOwnProperty('bans')) {
	                            	$gameData.teams.red.bans = $gameData.teams.red.bans.map(function (ban) {
	                            		$thisBan = null;
	                            		Object.keys(api.champions.data).forEach(function (ele, ind, arr) {
	                            			if (ban.championId == api.champions.data[ele].key) {
	                            				$thisBan = ele;
	                            			}
	                            		});
	                            		return $thisBan;
	                            	});
                            	}
                            	if ($gameData.teams.blue.hasOwnProperty('bans')) {
	                            	$gameData.teams.blue.bans = $gameData.teams.blue.bans.map(function (ban) {
	                            		$thisBan = null;
	                            		Object.keys(api.champions.data).forEach(function (ele, ind, arr) {
	                            			if (ban.championId == api.champions.data[ele].key) {
	                            				$thisBan = ele;
	                            			}
	                            		});
	                            		return $thisBan;
	                            	});
                            	}
                                callback($gameData);
                            }
                        });

                    })
                });
            }
		});
		

	}

	api.getPlayerInfo = function ($team, $teamColour, $participants, $gameData, callback) {

		/*
		*	class @getPlayerInfo
		*
		*	@param $team - An array of participants relating to one team in a game
		*	@param $teamColour - the colour of the team passed, used to recombining the data into the correct format after the mastery data is added
		*	@param $participants - The participants array from the match api reponse
		*	@param $gameData - The whole gameData object the team data is added to after the mastery data is added
		*	@param callback - A callback function for returning data
		*
		*	desc - Function loops over each team and adds a mastery rating for that champion coming directly from the riot mastery data api
		*	Triggers an event when each team member is done and once the count hits 5, recombines data into the GameData object
		*/

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
