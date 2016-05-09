/** @jsx React.DOM */


/**
 * class    @SelectedChampion
 *
 * states
 *  - player: the player object received
 *
 *  desc    This component does all of the information display stuff for a players independent stats, the player
 *          object used contains a huge amount of information about the player that we can look through and
 *          display, some information will not be presented however as this would make the game
 *          too easy to players
 */
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
        /**
         * There are two parts to this render, we want to render the items that the player had at the end of the game
         * as this is vitally important to allow players to work out certain questions such as who had the highest
         * crit.
         */
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