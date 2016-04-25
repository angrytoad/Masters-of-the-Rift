// db.js created by Salam
// Schema/Models for mongodb records

module.exports = function (mongoose) {

	$userSchema = new mongoose.Schema({

		loginId: String,
		summonerName: String,
		password: String,
		salt: String,
		region: String

	});
	$users = mongoose.model('User', $userSchema);

	this.Users = $users

    
	$sessionSchema = new mongoose.Schema({

		loginId: { type: [String], index: true },
		sessionId: String,
		time:{ type: Date, default: Date.now }

	});
	var $sessions = mongoose.model('Sessions', $sessionSchema);

	this.Sessions = $sessions;
    
	var $validateSession = function($token, $loginId) {
		var $Date = new Date;
		$sessions.findOne({loginId: $loginId, sessionId: $token}, 'loginId sessionId Date', function(err, session) {
			if (err) {
				console.log('IMPORTANT MEGAERROR: ' + err);
			} else {
				console.log(session);
				if (typeof session === 'object') {
					console.log('1');
					if ((((new Date(session.time).getTime()) / 1000) + 2592000) < $Date.getTime() / 1000) {
						console.log('2');
						return {err: true, msg: 'Session exceeds 30 day timeout.'};
					} else {
						console.log('3');
						return {err: false, msg: 'Success!'};
					}
					console.log('5');
				} else {
					return {err: true, msg: 'No session found.'};
				}
			}
		});
		return {err: true, msg: 'POO'};
	}
	this.validateSession = $validateSession;
}