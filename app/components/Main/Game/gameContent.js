/** @jsx React.DOM */

var GameContent = React.createClass({

    getInitialState: function(){
        return({
            loggedIn:this.props.loggedIn,
            summoner:this.props.summoner,
            loginId:this.props.loginId,
            inQueue:false,
            inGame:false,
            matchId:''
        })
    },

    componentWillReceiveProps: function(nextProps){
        this.setState({
            loggedIn:nextProps.loggedIn,
            summoner:nextProps.summoner,
            loginId:nextProps.loginId
        });
    },

    setNotPlaying: function(){
        venti.trigger('changePlayState',{playing:false});
    },

    changeQueueStatus: function(data){
        if(data.inQueue){
            new Howl({
                urls: ['/assets/sounds/queueJoin.mp3'],
                autoplay:true,
                volume: 0.5
            });
        }else{
            new Howl({
                urls: ['/assets/sounds/queueLeave.mp3'],
                autoplay:true,
                volume: 0.5
            });
        }
        this.setState({
            inQueue:data.inQueue,
        });
    },
    
    clientLogout: function(){
        this.setState({
            inQueue:false
        })
    },

    matchFoundEvent: function(data){
        var countdownSound = new Howl({
            urls: ['/assets/sounds/countdown.mp3'],
            volume: 1.5
        });
        var matchstartSound = new Howl({
            urls: ['/assets/sounds/matchStart.mp3'],
            volume: 1
        });
        var counter = 0;

        venti.trigger('fadeOutMusic',{volume:0});

        var countdown = setInterval(function(){
            if(counter < 3){
                countdownSound.play();
            }
            counter++;
        },1000);
        var that = this;
        setTimeout(function(){

            venti.trigger('swapTrack',{track:'matchMusic.mp3'});
            venti.trigger('fadeInMusic',{volume:0.4});

            clearInterval(countdown);
            matchstartSound.play();
            $('.no-game').fadeToggle(3000,function(){

                that.setState({
                    inGame:true,
                    matchId:data.matchId
                });
                $('.yes-game').fadeToggle(1000);
            });
        },4000);
    },

    componentDidMount: function(){
        setTimeout(function(){
            $('#game').fadeToggle(400);
        },300);

        socket.on('matchFoundEvent',this.matchFoundEvent);
        
        venti.on('changeQueueStatus',this.changeQueueStatus);
        venti.on('clientLogout',this.clientLogout);
    },

    componentWillUnmount: function(){

        socket.removeListener('matchFoundEvent');

        venti.off('changeQueueStatus',this.changeQueueStatus);
        venti.off('clientLogout',this.clientLogout);
    },

    render: function(){
        return(
            <div id="game" className="container">
                {(
                    this.state.inGame
                    ?
                        <div className="yes-game">
                            <h4 className="center-align">You are now in a game</h4>
                            <Match loggedIn={this.state.loggedIn} summoner={this.state.summoner} loginId={this.state.loginId} matchId={this.state.matchId} />
                        </div>
                    :
                        <div className="no-game">
                            <button className="waves-effect waves-light btn blue-grey darken-2 faded right" onClick={this.setNotPlaying}>Back</button>
                            <h4>Enter the Queue</h4>
                            <QueueInformation loggedIn={this.state.loggedIn} inQueue={this.state.inQueue} />
                        </div>
                )}

            </div>
        )

    }
})