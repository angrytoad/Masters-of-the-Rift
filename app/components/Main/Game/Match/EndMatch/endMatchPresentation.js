/** @jsx React.DOM */


var EndMatchPresentation = React.createClass({

    getInitialState:function(){
        return({
            scores:this.props.scores,
            game:this.props.game,
            matchId:this.props.matchId,
            player:this.props.player,
            formattedScores:{}
        })
    },

    componentWillReceiveProps:function(nextProps){
        this.setState({
            scores:nextProps.scores,
            game:nextProps.game,
            matchId:nextProps.matchId,
            player:nextProps.player
        })
    },

    componentDidMount: function(){
        this.formatForPresentation();

        venti.on('fadeInDisplay',this.fadeInDisplay)
    },

    componentWillUnmount:function(){

        venti.off('fadeInDisplay',this.fadeInDisplay)
    },

    formatForPresentation: function(){
        var $formatted = {};
        var $participants = [];
        $participants.push(this.state.game.playerDetails.teams.blue);
        $participants.push(this.state.game.playerDetails.teams.red);

        console.log($participants);

        var that = this;
        Object.keys(this.state.scores).map(function(i,obj){
            if(that.state.scores.hasOwnProperty(i)){
                $formatted[i] = {};
                Object.keys(that.state.scores[i]).map(function(i2,obj2){
                    if(that.state.scores[i].hasOwnProperty(i2) && i2 !== 'score') {
                        obj2 = that.state.scores[i][i2];

                        if(typeof obj2['givenAns'] == 'number'){
                            for(var index=0;index<$participants.length;index++){
                                for(var index2=0;index2<$participants[index].length; index2++){

                                    $formatted[i][i2] = obj2;

                                    if(obj2['givenAns'] === $participants[index][index2].pId){
                                        $formatted[i][i2]['givenAns'] = $participants[index][index2].champion;
                                    }

                                    if(parseInt(obj2['correctAns']) === $participants[index][index2].pId){
                                        $formatted[i][i2]['correctAns'] = $participants[index][index2].champion;
                                    }
                                }
                            }
                        }else{
                            $formatted[i][i2] = obj2;
                        }
                    }
                });
            }
        });
        console.log(this.state.scores.hasOwnProperty(this.state.player));

        if(this.state.scores.hasOwnProperty(this.state.player) === false){
            $formatted[this.state.player] = {};
        }

        console.log($formatted);

        this.setState({
            formattedScores:$formatted
        });

    },

    fadeInDisplay: function(){
        setTimeout(function(){
            $('.end-match-display').fadeIn(2000,function(){
            });
        },500);
    },

    render: function(){
        if(Object.keys(this.state.formattedScores).length > 0) {
            var that = this;
            venti.trigger('fadeInDisplay');

            return (
                <div className="end-match-display">
                    <div className="final-scores row">
                        {Object.keys(this.state.formattedScores).map(function (i, obj) {
                            return (
                                <FinalScoreDisplay keyName={i} player={that.state.player} score={that.state.formattedScores[i]}/>
                            )
                        })}
                        <FinalCorrectScoreDisplay score={that.state.formattedScores[0]} />
                    </div>
                </div>
            )
        }else{
            return (
                <div>
                    Formatting scores...
                </div>
            )
        }
    }

})