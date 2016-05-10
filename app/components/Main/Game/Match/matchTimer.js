/** @jsx React.DOM */


/**
 * class    @MatchTimer
 *
 * states
 *  - timer: the initial time to set the timer to
 *  - timeLeft: the amount of time left in thematch
 *  - percentageLeft: a calculated percentage of the time left
 *  - lastTenSeconds: a Howl audio object to play during the last 10 seconds
 *
 *  desc    This component renders an svg to display the time left in the game, and at the end of the game this will
 *          call a match end to the server to end the game.
 */
var MatchTimer = React.createClass({

    getInitialState: function(){
        return({
            timer:120,
            timeLeft:120,
            percentageLeft:100,
            lastTenSeconds: new Howl({
                urls: ['/assets/sounds/countdown.mp3'],
                volume: 0.2
            })
        });
    },

    componentDidMount: function(){
        var that = this;
        var countDown = setInterval(function(){
            if(that.state.timeLeft > 0) {
                that.reduceTime();
            }else{
                that.callMatchEnd();
                clearInterval(countDown);
            }


        },1000);
    },

    reduceTime: function(){
        /**
         * Every second reduce the time left by 1 and if the timeLeft gets to displaying 10 seconds, sounds the
         * lastTenSeconds sound
         */
        if(this.state.timeLeft < 12){
            this.state.lastTenSeconds.play();
        }
        this.setState({
          timeLeft:this.state.timeLeft-1,
          percentageLeft:(100/this.state.timer)*(this.state.timeLeft-1)
        });
    },

    callMatchEnd: function(){
        venti.trigger('callMatchEnd');
    },

    render: function(){
        /**
         * Renders a MatchTimerSegment component that will render the segment for the timer
         */
        return(
            <div className="timer">
                <p className="timer-text">{this.state.timeLeft}</p>
                <svg className="timer-circle">
                    <MatchTimerSegment radi="100" value={this.state.percentageLeft} />
                </svg>
            </div>
        )
    }

});