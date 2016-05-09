/** @jsx React.DOM */


/**
 * class    @FinalCorrectScoreDisplay
 *
 * states
 *  - score: correct scores to render (from parent)
 *
 *  desc    This function displays the correct answers for the match based of the correct answers that it has been
 *          given from the server
 */
var FinalCorrectScoreDisplay = React.createClass({

    getInitialState: function(){
        return({
            score:this.props.score,
        })
    },

    componentWillReceiveProps: function(nextProps){
        this.setState({
            score:nextProps.score,
        })
    },

    componentDidMount: function(){
        var counter = 0;
        var correctSound = new Howl({
            urls: ['/assets/sounds/correct-answer-fade-in.mp3'],
            volume: 0.5
        });

        venti.on('reveal-winner',this.revealWinner);

        /**
         * Play nice animation to reveal the winner and show correct answers with dramatic effect
         */
        setTimeout(function(){
            $('.correct-answers-wrapper').fadeIn(1000, function(){
                $('.correct-answers .question-answer').each(function(i,elem){
                    counter++;
                    setTimeout(function(){
                        correctSound.play();
                        $(elem).slideDown(300);

                    },(1000*counter));
                });
                setTimeout(function(){
                    venti.trigger('reveal-winner');
                },6000);
            });
        },2000);
    },

    componentWillUnmount: function(){
        venti.off('reveal-winner',this.revealWinner);
    },

    componentWillMount: function(){
        var that = this;
        {Object.keys(this.state.score).map(function (i, obj) {
            if(typeof that.state.score[i] !== 'undefined'){
                that.setState({
                    score:that.state.score[i]
                });
            }
        })}
    },

    revealWinner: function(){
        new Howl({
            urls: ['/assets/sounds/reveal-winner.mp3'],
            autoplay:true,
            volume: 0.6
        });
        $('.final-scores .s4').each(function(i,elem){
            setTimeout(function(){
                $(elem).addClass('long-animated').addClass('tada');
            },500);
        });
        setTimeout(function(){
            venti.trigger('fadeOutLosers');
        },3000);
    },

    render: function(){
        /**
         * Render the final correct answers based off what was given by the server.
         */
        var that = this;
        return(
            <div className="col s4 correct-answers-wrapper">
                <div className="correct-score-title">
                    <h4 className="motr-pink">CORRECT ANSWERS</h4>
                </div>
                <div className="correct-answers">
                    {Object.keys(this.state.score).map(function (item, i) {
                        var imgString = "http://ddragon.leagueoflegends.com/cdn/6.9.1/img/champion/" + that.state.score[i]['correctAns'] + ".png"
                        if(that.state.score[i]['correctAns'] === 'blue' || that.state.score[i]['correctAns'] === 'red'){
                            return (
                                <div className="question-answer">
                                    <h5 className="motr-blue">Question #{i+1}</h5>
                                    <span>Correct: </span>
                                    <div className={that.state.score[i]['correctAns']}>
                                        {that.state.score[i]['correctAns'].toUpperCase()}
                                    </div>
                                </div>
                            )
                        }else{
                            return (
                                <div className="question-answer">
                                    <h5 className="motr-blue">Question #{i+1}</h5>
                                    <span>Correct: </span>
                                    <img className="icon" src={imgString}/>
                                </div>
                            )
                        }

                    })}
                </div>
            </div>
        )
    }

})