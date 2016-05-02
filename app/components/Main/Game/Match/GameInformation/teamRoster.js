/** @jsx React.DOM */

var TeamRoster = React.createClass({

    getInitialState: function(){
        return({
            team:this.props.data
        });
    },

    render: function(){
        return(
            <div className="col s6">
                <p className="flow-text">{this.props.name}</p>
                <div>
                    {Array.apply(null, this.state.team).map(function(item, i){
                        return (
                            <TeamMember data={item} number={i+1} />
                        );
                    }, this)}
                </div>

            </div>
        )
    }

});