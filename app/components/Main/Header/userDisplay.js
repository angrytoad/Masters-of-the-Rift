/** @jsx React.DOM */


/**
 * class    @UserDisplay
 *
 * states
 *  - loggedIn: is the user loggedIn? (From parent)
 *  - summoner: has a summoner name been provided (From parent)
 *  - loginId: has a loginId been provided? (From parent)
 *  - inGame: false, when in a game this will change to prevent the user from being able to logout
 *  - stats: object, this is updated when we receive the current users stats from the server
 *
 *  desc
 *          This component handles all the stuff related to displaying the current user in the top right of the page
 *          this component will request stats for a user and attempt to authenticate, if this is successful
 *          then we'll changed the logged in state to ensure that user information is displayed.
 */
var UserDisplay = React.createClass({

    getInitialState: function(){
        return({
            loggedIn:this.props.loggedIn,
            summoner:this.props.summoner,
            loginId:this.props.loginId,
            inGame:false,
            stats:{}
        })
    },

    componentWillReceiveProps: function(nextProps) {
        this.setState({
            loggedIn: nextProps.loggedIn,
            summoner: nextProps.summoner,
            loginId: nextProps.loginId
        });
    },

    componentDidMount: function(){
        /**
         * Request user stats and listen for a userStatsEvent back from the server
         */
        socket.emit('requestUserStats',{session:getSession()})

        socket.on('userStatsEvent',this.userStatsEvent);
        socket.on('matchFoundEvent',this.matchFoundEvent);

        venti.on('userStatsEndMatch',this.matchEndEvent);
    },

    componentWillUnmount: function(){
        socket.removeListener('userStatsEvent');
        socket.removeListener('matchFoundEvent',this.matchFoundEvent);

        venti.off('userStatsEndMatch',this.matchEndEvent);
    },

    userStatsEvent: function(data){
        /**
         * If we could successfully authenticate the user, trigger a changeLoggedState event to update the header and
         * populate it with our stats.
         */
        venti.trigger('changeLoggedState',{
            loggedIn:true,
            summoner:data.summoner,
            loginId:data.loginId,
        });
        this.setState({
            stats:data.stats
        })
    },

    pressedPlay: function(){
        /**
         * Load in the game component if we press the play button
         */
        venti.trigger('changePlayState',{playing:true});
    },

    requestLogout: function(){
        /**
         * Logout if user presses the logout button
         */
        socket.emit('logoutRequest',{session:getSession()});
        venti.trigger('clientLogout');
    },

    matchFoundEvent: function(){
        this.setState({inGame:true});
    },

    matchEndEvent: function(){
        this.setState({inGame:false});
    },

    render: function(){
        /**
         * Render stats and stuff depending on both the stats received in addition to the current state of the game.
         */
        return(
            <div id="user-display" className="header-secondary col s6 right-align">
                <div className="account-buttons col s6">
                    <button className="waves-effect waves-light btn-large motr-blue play-button" onClick={this.pressedPlay}><span className="motr-pink">Play</span></button>

                </div>
                <div className="col s6 user-account-information left-align">
                    <div className="col s12">
                        <h5>{this.state.summoner} <i>({this.state.loginId})</i></h5>
                        {(
                            this.state.inGame
                            ? <a href="#" className="motr-blue faded">You cannot logout in a game</a>
                            : <a href="#" className="motr-blue faded" onClick={this.requestLogout}>Logout</a>
                        )}
                    </div>
                    <div className="col s12 user-stats">
                        <ul>
                            <li className="col s6">
                                <span className="motr-pink">Won: </span>
                                {this.state.stats.gamesWon}
                            </li>
                            <li className="col s6">
                                <span className="motr-pink">Lost: </span>
                                {(this.state.stats.totalGames - this.state.stats.gamesWon)}
                            </li>
                            <li className="motr-blue col s6">
                                <span className="motr-pink">Total Score: </span>
                                {this.state.stats.totalScore}
                            </li>
                            {(
                                this.state.stats.totalGames == 0
                                ?
                                    <li className="col s6">
                                        <span className="motr-pink">Win Ratio: </span>
                                        N/A
                                    </li>
                                :
                                    <li className="col s6">
                                        <span className="motr-pink">Win Ratio: </span>
                                        {((100/this.state.stats.totalGames)*this.state.stats.gamesWon).toFixed(2)}%
                                    </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
})