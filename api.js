/**
 * Created by Tom on 23/04/2016.
 * A simple interface for making api calls.
 */

 module.exports = function() {

 	$api = require('riot-games-api-nodejs');
 	this.key = 'someKey';

 	var getMatch = function($region, $id) {

 		if ($id == null) { //if no id is set, generate a random number
 			$id = (Math.random() * 9999) + 1;
 		}

 		var $match = null;

 		api.match.match($id, {}, function(err, data) {
 			if (err) {
 				console.log(err.message);
 			} else {
 				console.log(data);
 				$match = data;
 			}

 		});
 		return $match;
 	}

 	this.getMatch = getMatch

 	var getPlayerInfo = function($match) {



 	}

 }
