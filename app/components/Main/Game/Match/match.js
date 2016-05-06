/** @jsx React.DOM */

var Match = React.createClass({

    getInitialState: function(){
        return({
            loggedIn:this.props.loggedIn,
            summoner:this.props.summoner,
            loginId:this.props.loginId,
            matchId:this.props.matchId,
            gameData:{},
            gameDataReceived:false
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

        socket.on('requiredGameDataEvent',this.requiredGameDataEvent)
    },

    componentWillUnmount: function(){
        venti.off('callMatchEnd',this.callMatchEnd);
    },

    callMatchEnd: function(){
        socket.emit('callMatchEnd');
    },

    requiredGameDataEvent: function(data){
        /*
            - Object (Object
              - Teams (Object)
                - Red (Arrays of Players)
                    - Player (Object)
                - Blue (Arrays of Players)
                    - Player (Object)


        */
        console.log(data);
        this.setState({
            gameDataReceived:true,
            gameData:data
        });
    },

    render: function(){
        console.log(this.state.gameDataReceived);
        if(this.state.gameDataReceived === true) {
            return (
                <div className="match-wrapper row">
                    <div className="col s4 left-wrapper">
                        <div className="timer-wrap">
                            <MatchTimer />
                        </div>
                        <div>
                            <PlayerInformation />
                        </div>
                    </div>
                    <div className="col s8">
                        <GameInformation data={this.state.gameData}/>
                        <OpponentInformation />
                    </div>
                    <div className="match-answers expanded">
                        <MatchAnswers data={this.state.gameData.questions} game={this.state.gameData} />
                    </div>
                </div>
            )
        }else{
            return (
                <div>
                    <h4 className="center-align">Preparing the game...</h4>
                    <p className="flow-text">
                        Waiting on server... {this.state.matchId}
                    </p>
                </div>
            )
        }
    }

})