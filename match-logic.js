/**
 * Created by Tom on 23/04/2016.
 */

 module.exports = function($id, $p1, $p2) {

 	this.id = $id;
 	this.players = [$p1, $p2];
 	this.api = require('./api.js');

 	var initGamestate = function() {



 	}
 	this.initGamestate = initGamestate;

 	this.initGamestate();

 }
