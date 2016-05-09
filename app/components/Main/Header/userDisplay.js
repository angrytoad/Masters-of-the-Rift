/** @jsx React.DOM */

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
        socket.emit('requestUserStats',{session:getSession()})

        socket.on('userStatsEvent',this.userStatsEvent);
        socket.on('matchFoundEvent',this.matchFoundEvent);
    },

    componentWillUnmount: function(){
        socket.removeListener('userStatsEvent');
        socket.removeListener('matchFoundEvent',this.matchFoundEvent);
    },

    userStatsEvent: function(data){
        console.log('USER STATS RECEIVED AND SUCCESSFUL AUTHENTICATION MADE!');
        console.log(data);
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
        venti.trigger('changePlayState',{playing:true});
    },

    requestLogout: function(){
        socket.emit('logoutRequest',{session:getSession()});
        venti.trigger('clientLogout');
    },

    matchFoundEvent: function(){
        this.setState({inGame:true});
    },

    render: function(){
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