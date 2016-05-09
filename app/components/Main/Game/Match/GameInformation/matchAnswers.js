/** @jsx React.DOM */


/**
 * class    @MatchAnswers
 *
 * states
 *  - questions: questions that have been asked by the server (from parent)
 *  - game: the game object sent by the server (from parent)
 *  - matchId: the current matchId (from parent)
 *  - submittedAnswers: the answers that have been submitted to the server
 *  - player: The player unique id (from parent)
 *  - answersSubmitted: A true/false on whether answers have been submitted yet.
 *
 *  desc    This component shows and deals with all of the question related stuff in the game, this component is in
 *          charge of rendering the questions in addition to handling question submission and things of that
 *          nature.
 */
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
        /**
         * Checks that all answers have been given and submits the answers to the server.
         */
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
        /**
         * Checks to see if all of the questions have been answered before the player can submit their answers.
         */
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
        /**
         * This component renders the questions that are shown to the player in addition to showing a dynamic component
         * that shows the progress of the other player on their questions that updates in real time.
         */
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