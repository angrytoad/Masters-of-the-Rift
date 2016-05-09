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
        var matchstartSound = new Howl({
            urls: ['/assets/sounds/matchStart.mp3'],
            volume: 1,
            autoplay:true
        });
        this.setState({
            inGame:true,
            matchId:data.matchId
        });
    },

    componentDidMount: function(){
        setTimeout(function(){
            $('#game').fadeToggle(400);
        },300);

        socket.on('matchFoundEvent',this.matchFoundEvent);
        
        venti.on('changeQueueStatus',this.changeQueueStatus);
        venti.on('clientLogout',this.clientLogout);
        venti.on('leaveMatch',this.leaveMatch);
    },

    componentWillUnmount: function(){

        socket.removeListener('matchFoundEvent');

        venti.off('changeQueueStatus',this.changeQueueStatus);
        venti.off('clientLogout',this.clientLogout);
        venti.off('leaveMatch',this.leaveMatch);
    },

    leaveMatch: function(){
        this.setState({
            inGame:false,
            inQueue:false,
            matchId:''
        });
        $('.no-game').slideDown(500);
    },

    render: function(){
        return(
            <div id="game" className="container">
                {(
                    this.state.inGame
                    ?
                        <div className="yes-game">
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