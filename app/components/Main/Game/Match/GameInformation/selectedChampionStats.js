/** @jsx React.DOM */


/**
 * class    SelectedChampionStats
 *
 * states
 *  - stats: The stats for a particular player that was selected from the TeamMember component
 *
 *  desc    This component prints all of the stats that we want to show in the game and makes them easily readable
 *          by the player
 */
var SelectedChampionStats = React.createClass({

    getInitialState: function(){
          return({
              stats:this.props.stats
          })
    },

    componentWillReceiveProps: function(nextProps){
        this.setState({
            stats:nextProps.stats
        })
    },

    render: function(){
        /**
         * Render all of the stats we need, therea re a few key areas that are displayed called
         *  - Coin & Carnage
         *      Displays gold earned/spent, kills, deaths and assists
         *  - Might & Magic
         *      Displays Magic and Physical damage dealt as well as creep score
         *  - KILLING MACHINE
         *      Displays the number of Double,Triple,Quad and Penta kills a player has
         *  - First for everything
         *      Displays whether the player got either First Blood, First Tower or First Inhib
         *
         */
        return(
            <div className="col s12 selected-champion-stats">
                <p className="flow-text champion-stats-title">
                    <img className="icon" src="http://ddragon.leagueoflegends.com/cdn/5.5.1/img/ui/score.png" />
                    <span><b>STATS & MORE</b></span>
                </p>
                <div className="general-stats">
                    <div className="stat-div">
                        <p className="flow-text stat-title">
                            Coin & Carnage
                        </p>
                        <div className="stat-item col s4 flow-text">
                            <div className="stat-item-title">
                                <img className="icon" src="/assets/images/icons/kills.png" />
                                <span>Kills: <b>{this.state.stats.kills}</b></span>
                            </div>
                        </div>
                        <div className="stat-item col s4 flow-text">
                            <div className="stat-item-title">
                                <img className="icon" src="/assets/images/icons/kills.png" />
                                <span>Deaths: <b>{this.state.stats.deaths}</b></span>
                            </div>
                        </div>
                        <div className="stat-item col s4 flow-text">
                            <div className="stat-item-title">
                                <img className="icon" src="/assets/images/icons/kills.png" />
                                <span>Assists: <b>{this.state.stats.assists}</b></span>
                            </div>
                        </div>


                        <div className="stat-item col s12 flow-text">
                            <div className="stat-item-title">
                                <img className="small-icon" src="http://ddragon.leagueoflegends.com/cdn/5.5.1/img/ui/gold.png" />
                                <span>Gold Earned: <b><span className="gold-stat">{numeral(this.state.stats.goldEarned).format('0.0a')}</span></b></span>
                            </div>
                        </div>
                        <div className="stat-item col s12 flow-text">
                            <div className="stat-item-title">
                                <img className="small-icon" src="http://ddragon.leagueoflegends.com/cdn/5.5.1/img/ui/gold.png" />
                                <span>Gold Spent: <b><span className="gold-stat">{numeral(this.state.stats.goldSpent).format('0.0a')}</span></b></span>
                            </div>
                        </div>
                    </div>


                    <div className="stat-div">
                        <p className="flow-text stat-title">
                            Might & Magic
                        </p>
                        <div className="stat-item col s12 flow-text">
                            <div className="stat-item-title">
                                <img className="icon" src="/assets/images/icons/ability-power.png" />
                                <span>AP Damage Dealt: <b><span className="ap-damage">{this.state.stats.magicDamageDealtToChampions}</span></b></span>
                            </div>
                        </div>
                        <div className="stat-item col s12 flow-text">
                            <div className="stat-item-title">
                                <img className="icon" src="/assets/images/icons/attack-damage.png" />
                                <span>AD Damage Dealt: <b><span className="ad-damage">{this.state.stats.physicalDamageDealtToChampions}</span></b></span>
                            </div>
                        </div>
                        <div className="stat-item col s4 flow-text">
                            <div className="stat-item-title">
                                <img className="icon" src="/assets/images/icons/minion-kills.png" />
                                <span>CS: <b>{this.state.stats.minionsKilled}</b></span>
                            </div>
                        </div>
                    </div>


                    <div className="stat-div">
                        <p className="flow-text stat-title">
                            KILLING MACHINE
                        </p>
                        <div className="stat-item col s12 flow-text">
                            <div className="stat-item-title">
                                <img className="icon" src="/assets/images/icons/crit.png" />
                                <img className="icon" src="/assets/images/icons/crit.png" />
                                <span>Double Kills: <b><span className="double-kills">{this.state.stats.doubleKills}</span></b></span>
                            </div>
                        </div>
                        <div className="stat-item col s12 flow-text">
                            <div className="stat-item-title">
                                <img className="icon" src="/assets/images/icons/crit.png" />
                                <img className="icon" src="/assets/images/icons/crit.png" />
                                <img className="icon" src="/assets/images/icons/crit.png" />
                                <span>Triple Kills: <b><span className="double-kills">{this.state.stats.tripleKills}</span></b></span>
                            </div>
                        </div>
                        <div className="stat-item col s12 flow-text">
                            <div className="stat-item-title">
                                <img className="icon" src="/assets/images/icons/crit.png" />
                                <img className="icon" src="/assets/images/icons/crit.png" />
                                <img className="icon" src="/assets/images/icons/crit.png" />
                                <img className="icon" src="/assets/images/icons/crit.png" />
                                <span>Quadra Kills: <b><span className="double-kills">{this.state.stats.quadraKills}</span></b></span>
                            </div>
                        </div>
                        <div className="stat-item col s12 flow-text">
                            <div className="stat-item-title">
                                <img className="icon" src="/assets/images/icons/crit.png" />
                                <img className="icon" src="/assets/images/icons/crit.png" />
                                <img className="icon" src="/assets/images/icons/crit.png" />
                                <img className="icon" src="/assets/images/icons/crit.png" />
                                <img className="icon" src="/assets/images/icons/crit.png" />
                                <span>Penta Kills: <b><span className="double-kills">{this.state.stats.pentaKills}</span></b></span>
                            </div>
                        </div>
                    </div>

                    <div className="stat-div firsts">
                        <p className="flow-text stat-title">
                            First for everything
                        </p>
                        <div className="stat-item col s12 flow-text">
                            <div className="stat-item-title">
                                {
                                    this.state.stats.firstBloodKill ? <img className="icon" src="/assets/images/tick.png" /> : <img className="icon" src="/assets/images/cross.png" />
                                }
                                <span>First Blood</span>
                            </div>
                        </div>
                        <div className="stat-item col s12 flow-text">
                            <div className="stat-item-title">
                                {
                                    this.state.stats.firstInhibitorKill ? <img className="icon" src="/assets/images/tick.png" /> : <img className="icon" src="/assets/images/cross.png" />
                                }
                                <span>First Inhib</span>
                            </div>
                        </div>
                        <div className="stat-item col s12 flow-text">
                            <div className="stat-item-title">
                                {
                                    this.state.stats.firstTowerKill ? <img className="icon" src="/assets/images/tick.png" /> : <img className="icon" src="/assets/images/cross.png" />
                                }
                                <span>First Tower</span>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        )
    }

})