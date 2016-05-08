/** @jsx React.DOM */


var OpponentInformation = React.createClass({

    getInitialState: function(){
        return({
            opponentsAnswers: [0,0,0,0,0],
            player: this.props.player,
            matchId: this.props.matchId,
            parentAnswers:this.props.answers,
        })
    },

    componentWillReceiveProps: function(nextProps){
          this.setState({
              player:nextProps.player,
              matchId:nextProps.matchId,
              parentAnswers:nextProps.answers
          })
    },

    componentDidMount: function(){
        socket.on('answerCountEvent',this.answerCountEvent);
    },

    componentWillUnmount: function(){
        socket.removeListener('answerCountEvent',this.answerCountEvent);
    },

    answerCountEvent: function(data){
        if(data.player !== this.state.player) {
            console.log(data);
            var answerArray = [0,0,0,0,0];
            for (var i = 0; i < data.count; i++) {
                answerArray[i] = 1;
            }
            console.log(answerArray);
            this.setState({opponentsAnswers: answerArray});
            venti.trigger('parentStoreOpponentAnswers',{opponentAnswers:answerArray});
        }
    },

    render: function(){
        console.log(this.state.parentAnswers);
        if(typeof this.state.parentAnswers === 'undefined') {
            return (
                <div className="center-align opponent-answers">
                    <p><b>Your opponents progress</b></p>
                    {Array.apply(null, this.state.opponentsAnswers).map(function (item, i) {
                        var idString = 'filled-in-box-' + i;
                        console.log('ITEM: ' + item);
                        if (item === 0) {
                            return (
                                <Checkbox disabled={true} identifier={idString}/>
                            );
                        } else {
                            return (
                                <Checkbox disabled={false} identifier={idString}/>
                            );
                        }

                    }, this)}
                </div>
            )
        }else{
            return (
                <div className="center-align opponent-answers">
                    <p><b>Your opponents progress</b></p>
                    {Array.apply(null, this.state.parentAnswers).map(function (item, i) {
                        var idString = 'filled-in-box-' + i;
                        console.log('ITEM: ' + item);
                        if (item === 0) {
                            return (
                                <Checkbox disabled={true} identifier={idString}/>
                            );
                        } else {
                            return (
                                <Checkbox disabled={false} identifier={idString}/>
                            );
                        }

                    }, this)}
                </div>
            )
        }
    }
})

