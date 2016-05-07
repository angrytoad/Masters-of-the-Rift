/** @jsx React.DOM */

var TeamRoster = React.createClass({

    getInitialState: function(){
        return({
            team:this.props.data,
            game:this.props.game
        });
    },

    render: function(){
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