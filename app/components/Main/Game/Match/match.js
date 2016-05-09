/** @jsx React.DOM */


/**
 * class    @Match
 *
 * states
 *  - loggedIn: is the user logged in? (from parent)
 *  - summoner: what is the users summoner name? (from parent)
 *  - loginId: what is the users unique id? (from parent)
 *  - matchId: what match is the user currently assigned to? (from parent)
 *  - gameData: object that gets populated with the game data needed to render
 *  - gameDataReceived: has game data been received 
 *  - matchEnded: has the match ended?
 *  - shareScreen: should be we showing the shareScreen at the end of the match?
 *
 *  desc    This handles everything required to manage the match state and data between players, depending on various
 *          conditions, different components will render, in summary there are three key render states, they are
 *          ShareScreen, EndMatch and Match components. each of these send and receives varying information
 *          between the server, Match components are the most interesting as they demonstrate a working
 *          relationship between both clients in the match and server.
 */
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
        /**
         * Trigger a the correct events when we want to end the match and show the share screen
         */
        venti.on('callMatchEnd',this.callMatchEnd);
        venti.on('shareScreen',this.sharingScreen);

        /**
         * Listen for the requiredGameDataEvent in order to give us the information we need to get the match going.
         */
        socket.on('requiredGameDataEvent',this.requiredGameDataEvent);
        socket.on('callMatchEndEvent',this.closeDownMatch);
    },

    componentWillUnmount: function(){
        /**
         * Remove listeners for events
         */
        venti.off('callMatchEnd',this.callMatchEnd);
        venti.off('shareScreen',this.sharingScreen);

        socket.removeListener('requiredGameDataEvent',this.requiredGameDataEvent);
        socket.removeListener('callMatchEndEvent',this.closeDownMatch);
    },

    callMatchEnd: function(){
        socket.emit('submitAnswers',{
            gameId:this.state.matchId,
            answers:[0,0,0,0,0],
            player:this.props.player
        });
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
        /**
         * If gameData has been received and the match has ended render the EndMatch component, if data has been
         * received and shareScreen is set to true then render the ShareScreen component, otherwise render
         * the Match components needed.
         *
         * If No data has been received render a waiting message until data has been received, if you are testing this
         * on your own environment and you are stuck on Waiting on Serve then this typically means that something
         * has gone wrong on the server end, occasionally there are hiccups with the API endpoint that haven't been
         * accounted for.
         */
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