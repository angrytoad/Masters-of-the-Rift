/** @jsx React.DOM */



var MatchTimer = React.createClass({

    getInitialState: function(){
        return({
            timer:120,
            timeLeft:120,
            percentageLeft:100
        });
    },

    componentDidMount: function(){
        var that = this;
        var countDown = setInterval(function(){
            console.log('playing sound');
            if(that.state.timeLeft > 0) {
                //that.state.sound.play();
                that.reduceTime();
            }else{
                that.callMatchEnd();
            }
        },1000);
    },

    reduceTime: function(){
        this.setState({
          timeLeft:this.state.timeLeft-1,
          percentageLeft:(100/this.state.timer)*(this.state.timeLeft-1)
        });
    },

    callMatchEnd: function(){
        venti.trigger('callMatchEnd');
    },

    render: function(){

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