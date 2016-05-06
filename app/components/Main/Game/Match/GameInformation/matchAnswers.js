/** @jsx React.DOM */


var MatchAnswers = React.createClass({

    getInitialState: function(){
        return({
            questions:this.props.game.questions,
            game:this.props.game
        })
    },

    componentWillReceiveProps: function(nextProps){
          this.setState({
              questions:nextProps.game.questions,
              game:nextProps.game
          })
    },

    render: function(){
        console.log(this.state.questions);
        var that = this;
        return(
            <div className="col s12">
                <h4>Questions</h4>
                {Object.keys(this.state.questions).map(function(key){
                    return (
                        <Question data={that.state.questions[key]} players={that.state.game.playerDetails.teams} />
                    );
                })}
            </div>
        )
    }
})