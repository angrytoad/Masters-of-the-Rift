/** @jsx React.DOM */

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
        socket.on('endGameDataEvent',this.endGameDataEvent);

        socket.emit('endGameData',{gameId:this.state.matchId});
    },

    componentWillUnmount: function(){
        socket.removeListener('endGameDataEvent',this.endGameDataEvent);
    },

    endGameDataEvent: function(data){
        console.log('GOT SCORES: ');
        console.log(data);

        this.setState({
            gotEndGameData:true,
            scores:data.scores
        });

    },

    render: function(){

        return(
            <div className="end-match-wrapper">
                {(
                    this.state.gotEndGameData
                    ?
                        <EndMatchPresentation game={this.state.game} matchId={this.state.matchId} player={this.state.player} scores={this.state.scores}/>
                    :
                        <h4>Server is calculating scores...</h4>
                )}
            </div>
        )

    }

})