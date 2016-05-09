// db.js created by Salam
// Schema/Models for mongodb records

module.exports = function (mongoose) {

	$userSchema = new mongoose.Schema({

		/*  Schema for the user collection in mongodb
		*	Used to define what information is needed to add the user to the database collection
		*   @param loginId - A concatenation of region and summonername to create a unique per region logon
		*	@param summonerName - The users summoner name
		*	@param password - the users chosen password
		*	@param salt - the salt with which the password was hashed
		*	@param region - the user's region
		*/

		loginId: { type: String, index: true },
		summonerName: String,
		password: String,
		salt: String,
		region: String

	});
	$users = mongoose.model('User', $userSchema);

	this.Users = $users

    
	$sessionSchema = new mongoose.Schema({

		/*  Schema for the session data collection in mongodb
		*	Used to define what information is needed to check user sessions and keep users logged in
		*   @param loginId - A concatenation of region and summonername to create a unique per region logon
		*	@param sessionid - a random session id that is stored as a token cookie when the user logs in
		*	@param time - the time the token was set - Used to make sure sessions expire after 30 days of inactivity
		*/

		loginId: { type: [String], index: true },
		sessionId: String,
		time:{ type: Date, default: Date.now }

	});
	var $sessions = mongoose.model('Sessions', $sessionSchema);

	this.Sessions = $sessions;

	$profileSchema = new mongoose.Schema({

		/*  Schema for the users profile data
		*	Used to define what is needed for a document in this collection
		*   @param loginId - A concatenation of region and summonername to create a unique per region logon
		*	@param totalGames - the total number of games the user has played
		*	@param gamesWon - the total number of games won
		*	@param totalScore - the total culuilative score accrued over all played games
		*/

		loginId: { type: String, index: true },
		totalGames: Number,
		gamesWon: Number,
		totalScore: Number

	});
	$profiles = mongoose.model('Profiles', $profileSchema);
	this.Profiles = $profiles;
    
	var $validateSession = function($token, $loginId, $callBack) {

		/*	class @validateSessions
		*	@param $token - The token provided by the client when they navigate to the index page
		*	@param $loginId - The loginId provided by the client
		*	@param $callback - A callback function to return errors back to the client
		*
		*	desc - A function for validating user sessions with sessions stored in the sessions collection in the database
		*	if tokens and login Ids match session is upheld
		*/

		var $Date = new Date;
		$sessions.findOne({loginId: $loginId, sessionId: $token}, 'loginId sessionId Date', function(err, session) {
			if (err) {
                $callBack({err: true, msg:'There was an error fetching your session.'});
			} else {
				if (typeof session === 'object' && session != null) {
					if ((((new Date(session.time).getTime()) / 1000) + 2592000) < $Date.getTime() / 1000) {
						$callBack({err: true, msg: 'Session exceeds 30 day timeout.'});
					} else {
						$callBack({err: false, msg: 'Success!'});
					}
				} else {
					$callBack({err: true, msg: 'No session found.'});
				}
			}
		});
	}
	this.validateSession = $validateSession;
}