/**
 * Created by Tom on 23/04/2016.
 */

 module.exports = function($id, $p1, $p2, $apiHandler) {

 	this.id = $id;
 	this.players = [$p1, $p2];
 	

 	this.fetchGameDetails = function($gameId,callback) {
		//console.log(this.players[0]);
		var $match = $apiHandler.getMatch($gameId,null, null, function($match) {
			callback($match);
		});

 	};

 }
