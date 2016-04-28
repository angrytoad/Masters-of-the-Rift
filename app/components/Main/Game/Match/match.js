/** @jsx React.DOM */

var Match = React.createClass({

    getInitialState: function(){
        return({
            loggedIn:this.props.loggedIn,
            summoner:this.props.summoner,
            loginId:this.props.loginId,
            matchId:this.props.matchId
        })
    },

    componentWillReceiveProps: function(nextProps){
        this.setState({
            loggedIn:nextProps.loggedIn,
            summoner:nextProps.summoner,
            loginId:nextProps.loginId,
            matchId:nextProps.matchId
        });
    },

    componentDidMount: function(){
        socket.on('gameCloseEvent',this.gameCloseEvent);
    },

    componentWillUnmount: function(){
        socket.removeListener('gameCloseEvent',this.gameCloseEvent);
    },

    render: function(){
        return(
            <div>
                <p className="flow-text">
                    Welcome to match {this.state.matchId}, enjoy your stay.
                </p>
            </div>
        )
    }
})