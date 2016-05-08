/** @jsx React.DOM */


var MatchAnswers = React.createClass({

    getInitialState: function(){
        return({
            questions:this.props.game.questions,
            game:this.props.game,
            matchId:this.props.match,
            submittedAnswers:[],
            player:this.props.player,
            answersSubmitted:false,
        })
    },

    componentWillReceiveProps: function(nextProps){
        this.setState({
            questions:nextProps.game.questions,
            game:nextProps.game,
            matchId:nextProps.match,
            player:nextProps.player,
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
                answers:submittedAnswers,
                player:this.props.player
            });
            var that = this;
            $('.match-answers').fadeOut(500,function(){
                that.setState({
                    answersSubmitted:true
                });
                $('.match-answers').fadeIn(500);
            });

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
        socket.emit('answerCount',{
            match:this.state.matchId,
            count:submittedAnswers.length,
            player:this.state.player
        });
        if(submittedAnswers.length == 5){
            $('.match-answers .play-button').removeClass('disabled');
        }else{
            $('.match-answers .play-button').addClass('disabled');
        }

    },

    storeOpponentAnswers: function(data){
        this.setState({
            storedOpponentAnswers:data.opponentAnswers
        })
    },

    componentDidMount: function(){
        venti.on('checkForCompleteForm',this.checkForCompleteForm);
        venti.on('parentStoreOpponentAnswers',this.storeOpponentAnswers);
    },

    componentWillUnmount: function(){
        venti.off('checkForCompleteForm',this.checkForCompleteForm);
        venti.off('parentStoreOpponentAnswers',this.storeOpponentAnswers);
    },

    render: function(){
        console.log(this.state.questions);
        var that = this;
        if(this.state.answersSubmitted){
            return(
                <div className="col s12">
                    <p className="flow-text center-align">Your answers have been locked in, waiting on your opponent.</p>
                    <OpponentInformation player={this.state.player} matchId={this.state.matchId} answers={this.state.storedOpponentAnswers}/>
                </div>
            )
        }else{
            return(
                <div className="col s12">
                    <h4>Questions</h4>
                    {Object.keys(this.state.questions).map(function(key){
                        return (
                            <Question data={that.state.questions[key]} players={that.state.game.playerDetails.teams} />
                        );
                    })}
                    <a className="waves-effect waves-light btn-large motr-pink play-button disabled" onClick={this.submitAnswers}>Submit Answers</a>
                    <OpponentInformation player={this.state.player} matchId={this.state.matchId}/>
                </div>
            )
        }

    }
})