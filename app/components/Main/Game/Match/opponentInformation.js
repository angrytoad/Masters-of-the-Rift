/** @jsx React.DOM */

/**
 * class    @OpponentInformation
 * 
 * states
 *  - opponentAnswers: this is an array of eithe 0/1 to determine whether your opponent has filled out a question
 *  - player: the uniqueid of the player (from parent)
 *  - matchId: the match id (from parent)
 *  - parentAnswers: answers that have been given by the player (from parent)
 *
 *  desc    This component deal with displaying your opponents progress as they complete questions
 */
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
            var answerArray = [0,0,0,0,0];
            for (var i = 0; i < data.count; i++) {
                answerArray[i] = 1;
            }
            this.setState({opponentsAnswers: answerArray});
            venti.trigger('parentStoreOpponentAnswers',{opponentAnswers:answerArray});
        }
    },

    render: function(){
        /**
         * Loop over the answers that your opponent has given and render the amount of answers as ticked checkboxes
         */
        if(typeof this.state.parentAnswers === 'undefined') {
            return (
                <div className="center-align opponent-answers">
                    <p><b>Your opponents progress</b></p>
                    {Array.apply(null, this.state.opponentsAnswers).map(function (item, i) {
                        var idString = 'filled-in-box-' + i;
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

