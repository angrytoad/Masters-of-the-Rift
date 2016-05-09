/** @jsx React.DOM */


/**
 * class    @QuestionTeamDisplay
 *
 * states
 *  - team: the team of players that needs to be rendered (from parent)
 *  - teamName: the name of the team that needs to be rendered (from parent)
 *
 *  desc    Renders the team that it was given into the parent component
 */
var QuestionTeamDisplay = React.createClass({

    getInitialState: function(){
        return({
            team:this.props.team,
            teamName:this.props.teamName
        })
    },

    render: function(){
        return(
            <div className="col s12 champions-wrapper">
                {Array.apply(null, this.state.team).map(function(item, i){
                    return (
                        <TeamMember data={item} number={i+1} question="true" participant={item.pId}/>
                    );
                }, this)}
            </div>
        )
    }

})