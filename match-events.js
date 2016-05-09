/**
 * Created by Tom on 23/04/2016.
 */

var matchEvents = module.exports = {};
	matchEvents.parseAnswers = function(data, socket, questions, matches) {

		/*
		*	class @parseAnswers
		*
		*	@param data - Data object containing the gameId for the supplied answers
		*	@param socket - The socket for the client that submitted the answers
		*	@param questions - The set of questions for the given game
		*	@param matches - The object of matches currently ongoing
		*
		*	desc - This functions recieves submitted answers from a client and calculates the correct answers from api data before comparing them and returning a relevant score object, details what they got right/wrong and their score
		*	The method uses a question object to link questions to the relevant property in the api call response that the answr is being checked against.  The questions boil down into 3 categories - player bests, team totals and team properties.
		*	For each of these categories there is logic to determin the correct answer and compare to the given answer.  The score is totaled up from individual scores for each question set in the questions.json file
		*	The score object contains question under their id as objects.  THese object contain the answer given and the correct answer.  The score is a property of the return Object
		*/

		questionObj = {
			"1": 'winner', //who won
			"2": 'totalHeal', //Healing
			"3": 'totalTimeCrowdControlDelt', //CC
			"4": 'wardsPlaced', //Wards placed 
			"5": 'firstBlood', //FirstBlood
			"6": 'largestCriticalStrike', //LargestCrit
			"7": 'totalDamageTaken', //DamageTaken
			"8": 'dragonKills', //Dragons
			"9": 'baronKills', //Barons
			"10": 'wardsKilled',//WardKilled
			"11": 'physicalDamageDeltToChampions*',//teamPhysical
			"12": 'magicalDamageDeltToChampions*',//TeamMagical
			"13": 'wardsPlaced*',//PlacedWards
			"14": 'goldEarned*',//EarnedGold
			"15": 'goldSpent*',//SpentGold
		};
		gameDetails = matches[data.gameId].gameDetails;
		var $return = {};
		$score = 0;

		Object.keys(questions).map(function (questionNo, index) {

			if (questions[questionNo].type == "player") {

				$topPlayer = 1;
				Object.keys(gameDetails.playerStats).map(function (key) {
					if (gameDetails.playerStats[key][questionObj[questionNo]] > gameDetails.playerStats[$topPlayer][questionObj[questionNo]]) {
						$topPlayer = key;
					}
				});
				if ($topPlayer == data.answers[index]) {
					$score += questions[questionNo].points;
				}
				$return[index] = {givenAns: data.answers[index], correctAns: $topPlayer};	

			} else if (questions[questionNo].type == "team") {

				if (questionObj[questionNo].indexOf('*') != -1) {

					if (gameDetails.teams.red.winner == true) {
						$won = 100;
						$lost = 200;
					} else {
						$won = 200;
						$lost = 100;
					}
					$prop = questionObj[questionNo].slice(1, questionObj[questionNo].length - 1);
					$redTeam = 0;
					$blueTeam = 0;
					Object.keys(gameDetails.playerStats).map(function(player) {
						if (gameDetails.playerStats[player].winner == true) {
							if ($won = 100) {
								$redTeam += gameDetails.playerStats[player][$prop];
							} else {
								$blueTeam =+ gameDetails.playerStats[player][$prop];
							}
						} else {
							if ($won = 100) {
								$blueTeam += gameDetails.playerStats[player][$prop];
							} else {
								$redTeam =+ gameDetails.playerStats[player][$prop];
							}	
						}
					});
					if ($redTeam > $blueTeam) {
						$ans = 'red';
					} else {
						$ans = 'blue';
					}
					if ($ans == data.answers[index]) {
						$score = $score += questions[questionNo].points;
					}
					$return[index] = {givenAns: data.answers[index], correctAns: $ans};

				} else {
					$correct = false;
					if (gameDetails.teams[data.answers[index]][questionObj[questionNo]] == true) {
						$score += questions[questionNo].points;
						$correct = true;
					}
					if ($correct == true && data.answers[index] == 'red') {
						$return[index] = {givenAns: data.answers[index], correctAns: 'red'};
					}  else if ($correct == true && data.answers[index] == 'blue') {
						$return[index] = {givenAns: data.answers[index], correctAns: 'blue'};
					} else if ($correct == false && data.answers[index] == 'blue') {
						$return[index] = {givenAns: data.answers[index], correctAns: 'red'};
					} else {
						$return[index] = {givenAns: data.answers[index], correctAns: 'blue'};
					}


				}

			}

		});
		$return.score = $score;
		return $return;
	}