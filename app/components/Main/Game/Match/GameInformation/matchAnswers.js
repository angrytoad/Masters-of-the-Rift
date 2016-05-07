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
                submittedAnswers.push(answer);
            }
        });
        
        if(submittedAnswers.length == 5){
            new Howl({
                urls: ['/assets/sounds/lockAnswer.mp3'],
                autoplay:true,
                volume: 0.8
            });
            this.setState({
                submittedAnswers:submittedAnswers
            });
            socket.emit('submitAnswers',{
                gameId:this.state.matchId,
                answers:submittedAnswers
            });
            $('.match-answers').fadeToggle(500);
        }

    },

    checkForCompleteForm: function(){
        var submittedAnswers = [];
        $('.question').each(function(i,obj){
            var answer = $(obj).find('.selected').data('answer');
            if(typeof answer !== 'undefined'){
                submittedAnswers.push(answer);
            }
        });
        console.log(submittedAnswers.length);
        if(submittedAnswers.length == 5){
            console.log(submittedAnswers);
            $('.match-answers .play-button').removeClass('disabled');
        }else{
            $('.match-answers .play-button').addClass('disabled');
        }

    },

    componentDidMount: function(){
        venti.on('checkForCompleteForm',this.checkForCompleteForm);
    },

    componentWillUnmount: function(){
        venti.off('checkForCompleteForm',this.checkForCompleteForm);
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
                <a className="waves-effect waves-light btn-large motr-pink play-button disabled" onClick={this.submitAnswers}>Submit Answers</a>
                <OpponentInformation />
            </div>
        )
    }
})