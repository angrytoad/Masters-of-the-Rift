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
            var $champImg = 'http://ddragon.leagueoflegends.com/cdn/img/champion/loading/'+this.state.player.champion+'_0.jpg';
            return (
                <div className="col s12 player-info-wrapper">
                    <div className="player-info center-align">
                        <h4>{this.state.player.playerName}</h4>
                        <p className="flow-text label">
                            Team: <b>{(typeof this.state.player.team !== 'undefined' ? this.state.player.team.toUpperCase() : 'Not Found')}</b></p>
                        <p className="flow-text label">Last Season: <b>{this.state.player.rankedBest}</b></p>
                        <p className="flow-text label">
                            <span className="motr-pink">Mastery Level: </span>
                            <span className="motr-blue"><b>{this.state.player.mastery}</b></span>
                        </p>
                    </div>
                    <div className="player-champion-info center-align">
                        <img className="champion-loading-img" src={$champImg} />
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