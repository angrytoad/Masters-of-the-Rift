/** @jsx React.DOM */


/**
 * class    @TeamRoster
 *
 * states
 *  - team: the team that needs to be rendered (from parent)
 *  - game: the game object (from parent)
 *
 *  desc    This component handles the rendering of the team and the passing of data to each team memeber that can be
 *          emitted to other components in the game.
 */
var TeamRoster = React.createClass({

    getInitialState: function(){
        return({
            team:this.props.data,
            game:this.props.game
        });
    },

    render: function(){
        /**
         * Render each member of the team as well as their bans each TeamMember component that is rendered gets sent
         * information that is specific to that player and this is what is used when sending player information to
         * other components in the match.
         */
        return(
            <div className="col s6 team-roster">
                <div className={this.props.classToGive}>
                    <div className="col s12 team-wrapper">
                        <div className="col s12">
                            <h3 className="flow-text">{this.props.name}</h3>
                        </div>
                        <div className="col s12 bans-wrapper">
                            {(typeof this.state.game.bans == 'undefined' ? '' : <TeamBans bans={this.state.game.bans} />)}
                        </div>
                        <div className="col s12 champions-wrapper">
                            <p className="flow-text label">Champions:</p>
                            {Array.apply(null, this.state.team).map(function(item, i){
                                return (
                                    <TeamMember data={item} number={i+1} />
                                );
                            }, this)}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

});