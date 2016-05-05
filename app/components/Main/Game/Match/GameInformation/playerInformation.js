/** @jsx React.DOM */


var PlayerInformation = React.createClass({

    getInitialState: function(){
        return({
            player:{}
        })
    },

    componentDidMount: function(){
        venti.on('displayPlayerInformation',this.displayPlayerInformation);
    },

    componentWillUnmount: function(){
        venti.off('displayPlayerInformation',this.displayPlayerInformation);
    },

    displayPlayerInformation: function(data){
        this.setState({
            player:data.player
        });
    },

    render: function(){
        if(typeof this.state.player.team !== 'undefined') {
            return (
                <div className="col s12">
                    <div className="player-info">
                        <h4>{this.state.player.playerName}</h4>
                        <p className="flow-text label">
                            Team: <b>{(typeof this.state.player.team !== 'undefined' ? this.state.player.team.toUpperCase() : 'Not Found')}</b></p>
                        <p className="flow-text label">Last Season: <b>{this.state.player.rankedBest}</b></p>
                        <p className="flow-text label">Mastery Level: <b>{this.state.player.mastery}</b></p>
                    </div>
                    <div className="player-champion-info">

                    </div>
                </div>
            )
        }else{
            return(
                <div>

                </div>
            )
        }
    }

})