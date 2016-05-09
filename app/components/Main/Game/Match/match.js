/** @jsx React.DOM */

var Match = React.createClass({

    getInitialState: function(){
        return({
            loggedIn:this.props.loggedIn,
            summoner:this.props.summoner,
            loginId:this.props.loginId,
            matchId:this.props.matchId,
            gameData:{},
            gameDataReceived:false,
            matchEnded:false,
            shareScreen:false
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
        venti.on('shareScreen',this.sharingScreen);

        socket.on('requiredGameDataEvent',this.requiredGameDataEvent);
        socket.on('callMatchEndEvent',this.closeDownMatch);
    },

    componentWillUnmount: function(){
        venti.off('callMatchEnd',this.callMatchEnd);
        venti.off('shareScreen',this.sharingScreen);

        socket.removeListener('requiredGameDataEvent',this.requiredGameDataEvent);
        socket.removeListener('callMatchEndEvent',this.closeDownMatch);
    },

    callMatchEnd: function(){
        socket.emit('callMatchEnd',{gameId:this.state.matchId});
    },

    closeDownMatch: function(){
        var that = this;
        $('.match-wrapper').fadeOut(300,function(){
            that.setState({
                matchEnded:true
            })
        });
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

    sharingScreen: function(){
        this.setState({
            matchEnded:false,
            shareScreen:true
        });
    },

    render: function(){
        if(this.state.gameDataReceived === true) {
            if(this.state.matchEnded){
               return (
                    <EndMatch game={this.state.gameData} matchId={this.state.matchId} player={this.state.loginId} />
               )
            }else if(this.state.shareScreen === true) {
                return(
                    <ShareScreen loginId={this.state.loginId} />
                )
            }
            else
            {
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
                        </div>
                        <div className="match-answers expanded">
                            <MatchAnswers data={this.state.gameData.questions} game={this.state.gameData}
                                          match={this.state.matchId} player={this.state.loginId}/>
                        </div>
                    </div>
                )
            }
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