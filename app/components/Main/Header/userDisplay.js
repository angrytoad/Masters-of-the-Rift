/** @jsx React.DOM */

var UserDisplay = React.createClass({

    getInitialState: function(){
        return({
            loggedIn:this.props.loggedIn,
            summoner:this.props.summoner,
            loginId:this.props.loginId,
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
    },

    componentWillUnmount: function(){
        socket.removeListener('userStatsEvent');
    },

    userStatsEvent: function(data){
        console.log('USER STATS RECEIVED AND SUCCESSFUL AUTHENTICATION MADE!');
        venti.trigger('changeLoggedState',{loggedIn:true,summoner:'Mr Phreak',loginId:'NA-Mr Phreak'});
    },

    pressedPlay: function(){
        venti.trigger('changePlayState',{playing:true});
    },

    requestLogout: function(){
        venti.trigger('clientLogout');
    },

    render: function(){
        return(
            <div id="user-display" className="header-secondary col s6 right-align">
                <div className="account-buttons col s6">
                    <button className="waves-effect waves-light btn-large motr-blue play-button" onClick={this.pressedPlay}><span className="motr-pink">Play</span></button>

                </div>
                <div className="col s6 user-account-information left-align">
                    <h5>{this.state.summoner} <i>({this.state.loginId})</i></h5>
                    <a href="#" className="motr-blue faded" onClick={this.requestLogout}>Logout</a>
                </div>
            </div>
        )
    }
})