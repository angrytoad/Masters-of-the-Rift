/** @jsx React.DOM */


var SelectedChampion = React.createClass({

    getInitialState: function(){
        return({
            player:this.props.player
        });
    },

    componentWillReceiveProps: function(nextProps){
        this.setState({
            player:nextProps.player
        })
    },

    render: function(){
        var roleIcon = '/assets/images/icons/lanes/'+this.state.player.playerObj.timeline.lane+'.png';
        return(
            <div className="col s12">
                <div className="col s12 selected-information-title">
                    <h4>
                        <img className="icon" src={roleIcon} />
                        {this.state.player.playerName} <b>({this.state.player.champion})</b></h4>
                </div>
                <div className="col s4 items-wrapper">
                    <p className="flow-text items-wrapper-title">
                        <img className="icon" src="http://ddragon.leagueoflegends.com/cdn/5.5.1/img/ui/items.png" />
                        <span><b>ITEMS</b></span>
                    </p>
                    <ItemDisplay stats={this.state.player.playerObj.stats} timeline={this.state.player.playerObj.timeline} />
                </div>
                <div className="col s8">
                    <SelectedChampionStats stats={this.state.player.playerObj.stats} />
                </div>
            </div>
        )
    }
})