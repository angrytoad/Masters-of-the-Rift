/** @jsx React.DOM */


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
                        <TeamMember data={item} number={i+1} question="true" />
                    );
                }, this)}
            </div>
        )
    }

})