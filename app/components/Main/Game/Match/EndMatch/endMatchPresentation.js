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

        venti.on('fadeInDisplay',this.fadeInDisplay);
        venti.on('fadeOutLosers',this.fadeOutLosers);
    },

    componentWillUnmount:function(){

        venti.off('fadeInDisplay',this.fadeInDisplay)
        venti.off('fadeOutLosers',this.fadeOutLosers);
    },

    fadeOutLosers: function(){
        $('.correct-answers-wrapper').addClass('faded');
        var scores = [];
        var that = this;
        var counter = 0;
        Object.keys(this.state.scores).map(function(i,obj){
            scores.push(that.state.scores[i]['score']);
            counter++;
        });
        console.log(scores);
        var currentHighest = 0;
        var winner = [];
        $('.answers').each(function(i,elem){
            if(scores[i] > currentHighest){
                winner = [];
                winner[i] = elem;
                currentHighest = scores[i];
            }else if(scores[i] == currentHighest){
                winner[i] = elem;
                currentHighest = scores[i];
            }
        });

        winner = winner.filter(function(){return true;});

        $('.answers').addClass('faded');
        var winnerNames = [];
        for(var i=0;i<winner.length;i++){
            var element = winner[i];
            $('#game').addClass('blackout');
            $(element).removeClass('faded');
            winnerNames.push($(element).find('.score-title p span:first-child').text())
        }

        console.log(winner);
        console.log(winnerNames);

        var winnerString = '';
        for(var i=0;i<winnerNames.length;i++){
            if(i == 0){
                winnerString += winnerNames[i];
            }else{
                winnerString += ' & '+winnerNames[i];
            }
        }

        $('.yes-game').append('<div class="winner-name animated bounceIn">' +
            'Winner:<br>' +
            winnerString + '!' +
            '</div>');

        setTimeout(function(){
            $('.winner-name').fadeOut(300,function(){
                $('#game').removeClass('blackout');
                $('.yes-game').slideUp(1000,function(){
                    $('.winner-name').remove();
                    venti.trigger('shareScreen');
                });
            });
        },2000);


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
            new Howl({
                urls: ['/assets/sounds/answer-fade-in.mp3'],
                autoplay: true,
                volume: 0.5
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
                                <FinalScoreDisplay keyName={i} player={that.state.player} score={that.state.formattedScores[i]} rawScore={that.state.scores[i]['score']}/>
                            )
                        })}
                        <FinalCorrectScoreDisplay score={this.state.formattedScores} />
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