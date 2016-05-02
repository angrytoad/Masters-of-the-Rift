/**
 * Created by Tom on 23/04/2016.
 */

 module.exports = function($id, $p1, $p2) {

 	this.id = $id;
 	this.players = [$p1, $p2];
 	var $apiHandler = require('./api.js');

 	this.fetchGameDetails = function(callback) {
		//console.log(this.players[0]);
		var $match = $apiHandler.getMatch(null, null, function($match) {
			callback($match);
		});

 	};

 }
