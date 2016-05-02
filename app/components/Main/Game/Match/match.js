/** @jsx React.DOM */

var Match = React.createClass({

    getInitialState: function(){
        return({
            loggedIn:this.props.loggedIn,
            summoner:this.props.summoner,
            loginId:this.props.loginId,
            matchId:this.props.matchId,
            gameData:{},
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
        venti.on('callMatchEnd',this.callMatchEnd);

        socket.on('requiredGameData',this.requiredGameDataEvent)
    },

    componentWillUnmount: function(){
        venti.off('callMatchEnd',this.callMatchEnd);
    },

    callMatchEnd: function(){
        socket.emit('callMatchEnd');
    },

    requiredGameDataEvent: function(){
        /*
            - Object (Object
              - Teams (Object)
                - Red (Arrays of Players)
                    - Player (Object)
                - Blue (Arrays of Players)
                    - Player (Object)


        */
    },

    render: function(){
        return(
            <div>
                <div className="timer-wrap">
                    <MatchTimer />
                </div>
                <GameInformation data={this.state.gameData} />
                <OpponentInformation />
            </div>
        )
    }
})