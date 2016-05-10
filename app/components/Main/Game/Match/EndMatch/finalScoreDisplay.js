/** @jsx React.DOM */


/**
 * class    FinalScoreDisplay
 *
 * states
 *  - score: the scores for the given player in the scores object (from parent)
 *  - keyName: this is the uniqueId of the player (from parent)
 *  - player: this is the uniqueId of the current player (from parent)
 *  - rawScore: this the raw points that a player earned from that match (from parent)
 *
 *  desc    This component displays the answers and score for a given player, this object is rendered twice as we
 *          loop over formattedScore object in endMatchPresentation.
 */
var FinalScoreDisplay = React.createClass({

    getInitialState: function(){
        return({
            score:this.props.score,
            keyName:this.props.keyName,
            player:this.props.player,
            rawScore:this.props.rawScore
        })
    },

    componentWillReceiveProps: function(nextProps){
        this.setState({
            score:nextProps.score,
            keyName:nextProps.keyName,
            player:nextProps.player
        })
    },

    componentDidMount: function(){
        var counter = 0;
        /**
         * Animate each question answers 200ms after each other to create a nice cascade effect
         */
        $('.answers .question-answer').each(function(i,elem){
            counter++;
            setTimeout(function(){
                $(elem).slideDown(300);
            },(200*counter));
        });
    },

    render: function(){
        /**
         * If the user has a score render their full answers as well as fetching either the champion icon or rendering
         * the team color depending on their answers, if they don't have any scores set then that means they failed to
         * answer the questions, so just fill out their answers with failed to answer.
         */
        if(Object.keys(this.state.score).length > 0) {
            var that = this;
            return (
                <div className="col s4 answers">
                    <div className="score-title">
                        <p className="motr-blue">{this.state.keyName}'s answers</p>
                        <div className="score">
                            <span className="motr-blue">SCORE: </span><span className="motr-pink">{this.state.rawScore}</span>
                        </div>
                    </div>
                    {Object.keys(this.state.score).map(function (item, i) {
                        var imgString = "http://ddragon.leagueoflegends.com/cdn/6.9.1/img/champion/" + that.state.score[i]['givenAns'] + ".png"
                        if(that.state.score[i]['givenAns'] === 'blue' || that.state.score[i]['givenAns'] === 'red'){
                            return (
                                <div className="question-answer">
                                    <h5 className="motr-blue">Question #{i+1}</h5>
                                    <span>Picked: </span>
                                    <div className={that.state.score[i]['givenAns']}>
                                        {that.state.score[i]['givenAns'].toUpperCase()}
                                    </div>
                                </div>
                            )
                        }else{
                            return (
                                <div className="question-answer">
                                    <h5 className="motr-blue">Question #{i+1}</h5>
                                    <span>Picked: </span>
                                    <img className="icon" src={imgString}/>
                                </div>
                            )
                        }

                    })}
                </div>
            )
        }else{
            var scoreArray = [0,0,0,0,0];
            return(
                <div className="col s4 answers">
                    <div className="score-title">
                        <p className="motr-blue">{this.state.keyName}'s answers</p>
                        <div className="score">
                            <span className="motr-blue">SCORE: </span><span className="motr-pink">{this.state.rawScore}</span>
                        </div>
                    </div>
                    {Array.apply(null, scoreArray).map(function(item, i){
                        return (
                            <div className="question-answer failed-to-answer">
                                <h5 className="motr-blue">Question #{i+1}</h5>
                                <span>Failed to submit an answer</span>
                            </div>
                        )
                    }, this)}
                </div>
            )

        }
    }

})