/** @jsx React.DOM */


var MatchAnswers = React.createClass({

    getInitialState: function(){
        return({
            questions:this.props.game.questions,
            game:this.props.game,
            matchId:this.props.match,
            submittedAnswers:[]
        })
    },

    componentWillReceiveProps: function(nextProps){
        this.setState({
            questions:nextProps.game.questions,
            game:nextProps.game,
            matchId:nextProps.match
        });
    },

    submitAnswers: function(){
        var submittedAnswers = [];
        $('.question').each(function(i,obj){
            var answer = $(obj).find('.selected').data('answer');
            if(typeof answer == 'undefined'){
                $(obj).addClass('no-answer');
            }else{
                submittedAnswers[i] = answer;
            }
        });
        this.setState({
            submittedAnswers:submittedAnswers
        });
        console.log('sending answers');
        socket.emit('submitAnswers',{
            gameId:this.state.matchId,
            answers:submittedAnswers
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
                <a className="waves-effect waves-light btn green darken-1 white-text" onClick={this.submitAnswers}>Submit Answers</a>
            </div>
        )
    }
})