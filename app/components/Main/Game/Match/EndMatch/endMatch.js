/** @jsx React.DOM */


/**
 * class    @endMatch
 *
 * states
 *  - game: the game object containing all information related to the match (from parent)
 *  - matchId: the matchId that this component is associated with (from parent)
 *  - player: the uniqueId of the current player (from parent)
 *  - gotEndGameData: has the end game score data been received from the server?
 *  - scores: scores that are sent back from the server to show at the end game information screen
 *
 *  desc    This component handles receiving scores from the server and then rending the end match information
 *          component in order to display the final scores to each user.
 */
var EndMatch = React.createClass({

    getInitialState: function(){
        return({
            game:this.props.game,
            matchId:this.props.matchId,
            player:this.props.player,
            gotEndGameData:false,
            scores:[]
        })
    },

    componentWillReceiveProps: function(nextProps){
        this.setState({
            game:nextProps.game,
            matchId:nextProps.matchId,
            player:nextProps.player
        });
    },

    componentDidMount: function(){
        /**
         * When we get endGameDataEvent from the server, set the scores to what we got.
         */
        socket.on('endGameDataEvent',this.endGameDataEvent);

        /**
         * Emit an event to the server to let them know to send back the scores needed to display the end of the
         * match. we have to send the match id along with this else the server will have no idea where to
         * send the data back to.
         */
        socket.emit('endGameData',{gameId:this.state.matchId});
    },

    componentWillUnmount: function(){
        socket.removeListener('endGameDataEvent',this.endGameDataEvent);
    },

    endGameDataEvent: function(data){
        /**
         * Set our score state to scores received back from the server.
         */
        this.setState({
            gotEndGameData:true,
            scores:data.scores
        });

    },

    render: function(){
        /**
         * Because it putting everything in this component could be a real pain the ass to read, we've put the
         * display portion inside its own component and passed these component states into it. Must more
         * readable!
         */
        console.log(this.state.scores);
        return(
            <div className="end-match-wrapper">
                {(
                    this.state.gotEndGameData
                    ?
                        <EndMatchPresentation game={this.state.game} matchId={this.state.matchId} player={this.state.player} scores={this.state.scores}/>
                    :
                        <h4>Getting scores from server...</h4>
                )}
            </div>
        )

    }

})