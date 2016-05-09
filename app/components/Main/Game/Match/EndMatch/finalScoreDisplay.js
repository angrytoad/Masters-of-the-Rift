/** @jsx React.DOM */

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
        console.log('RAW SCORE '+this.state.rawScore);
        $('.answers .question-answer').each(function(i,elem){
            counter++;
            setTimeout(function(){
                $(elem).slideDown(300);
            },(200*counter));
        });
    },

    render: function(){
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
                <div className="col s4">
                    <h4>{this.props.keyName}'s score</h4>
                    {Array.apply(null, scoreArray).map(function(item, i){
                        return (
                            <div className="question-answer">
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