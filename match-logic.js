

 module.exports = function($id, $p1, $p2, $apiHandler) {

 	this.id = $id;
 	this.players = [$p1, $p2];


     /*
     fetchGameDetails runs all the code needed to create a match with the givenId,
     this is a very important function that probably should not be changed. AT ALL!
      */
 	this.fetchGameDetails = function($gameId,callback) {
		var $match = $apiHandler.getMatch($gameId,null, null, function($match) {
			callback($match);
		});

 	};

 }
