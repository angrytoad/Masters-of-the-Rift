/** @jsx React.DOM */


/**
 * class    EndMatchPresentation
 *
 * states
 *  - scores: scores from the server (from parent)
 *  - game: the game object that we have been using for everything (from parent)
 *  - matchId: our match id (from parent)
 *  - player: the uniqueid of the current player (from parent)
 *  - formattedScores: an object that is used to pretty-print the scores for each player.
 *
 *  desc    This component handles the actual presentation of data and the order in which events occur during
 *          presentation, we wanted to put this sequence on a track so its all automated and requires no
 *          input from the player whatsoever, we use jQuery to manipulate elements.
 */
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
        /**
         * formatForPresentation takes the scores and formats them into a nicely readable object that we can
         * go through and present in the render portion of this component, when the component mounts
         * (should only mount once) then we do this initial formatting.
         */
        this.formatForPresentation();

        venti.on('fadeInDisplay',this.fadeInDisplay);
        venti.on('fadeOutLosers',this.fadeOutLosers);
    },

    componentWillUnmount:function(){

        venti.off('fadeInDisplay',this.fadeInDisplay)
        venti.off('fadeOutLosers',this.fadeOutLosers);
    },

    fadeOutLosers: function(){
        /**
         * Do a nice little animation sequence to highlight the winner(s) of the game
         */
        $('.correct-answers-wrapper').addClass('faded');
        var scores = [];
        var that = this;
        var counter = 0;
        Object.keys(this.state.scores).map(function(i,obj){
            scores.push(that.state.scores[i]['score']);
            counter++;
        });
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

        new Howl({
            urls: ['/assets/sounds/winnerAnnounce.mp3'],
            autoplay:true,
            volume: 0.5
        });

        setTimeout(function(){
            $('.winner-name').fadeOut(300,function(){
                $('#game').removeClass('blackout');
                $('.yes-game').slideUp(1000,function(){
                    /**
                     * We need to ensure that we reset the formattedSectors afterwards when we change the state
                     * of the parent components to display the shareScreen.
                     */
                    that.setState({
                        formattedScores:{}
                    });
                    /**
                     * Update the header of the page to reflect the users new statistics after their game.
                     */
                    socket.emit('requestUserStats',{session:getSession()});
                    venti.trigger('userStatsEndMatch');

                    $('.winner-name').remove();
                    venti.trigger('shareScreen');
                });
            });
        },3500);


    },

    formatForPresentation: function(){
        /**
         * Make sure we format all of the scores received so that we can determine the winner easily and present the
         * the information in a clear and concise manner.
         */
        var $formatted = {};
        var $participants = [];
        $participants.push(this.state.game.playerDetails.teams.blue);
        $participants.push(this.state.game.playerDetails.teams.red);

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

        if(this.state.scores.hasOwnProperty(this.state.player) === false){
            $formatted[this.state.player] = {};
        }

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
        /**
         * Whilst we're waiting for the scores to be formatted we just display a message, when we get our formatted
         * scores we want to loop over the formattedScores object to display both players scores, in addition to
         * the answers that they chose for each question, this is all quite nicely animated.
         *
         * After that we want to render the FinalCorrectScoreDisplay component which will render the correct answers
         * for each question.
         */
        if(Object.keys(this.state.formattedScores).length > 0) {
            var that = this;
            venti.trigger('fadeInDisplay');

            return (
                <div className="end-match-display">
                    <div className="final-scores row">
                        {Object.keys(this.state.formattedScores).map(function (i, obj) {
                            console.log(that.state.scores)
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
                    Calculating...
                </div>
            )
        }
    }

})