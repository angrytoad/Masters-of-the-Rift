/** @jsx React.DOM */


var Question = React.createClass({

    getInitialState: function(){
        return({
            question:this.props.data,
            players:this.props.players,
        })
    },

    render: function(){
        if(this.state.question.type == 'player') {
            return (
                <div className="question col s12">
                    <p className="question-text">{this.state.question.question} ({this.state.question.points} pts)</p>
                    <QuestionTeamDisplay team={this.state.players.blue} teamName='BLUE'/>
                    <QuestionTeamDisplay team={this.state.players.red} teamName='RED'/>
                </div>
            )
        }else{
            return (
                <div className="question col s12">
                    <p className="question-text">{this.state.question.question} ({this.state.question.points} pts)</p>
                    <QuestionTeamChooser />
                </div>
            )
        }
    }

});

