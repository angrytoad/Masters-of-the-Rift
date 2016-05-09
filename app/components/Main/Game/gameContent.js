/** @jsx React.DOM */


/**
 * class    @GameContent
 *
 * states
 *  - loggedIn: is the user currently authenticated? (from parent)
 *  - summoner: the summoner name of the currently logged in user (from parent)
 *  - loginId: the unique id of the logged in user (from parent)
 *  - inQueue: is the user currently queuing?
 *  - inGame: is the user current in a game?
 *  - matchId: does the user have a matchId assigned to them to make match event calls?
 */
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
        socket.emit('leaveQueueRequest',{session:getSession()});
        this.setState({
            inQueue:false,
            inGame:false
        })
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


        /**
         * Listen for a matchFound Event, and if found, set the state of this component to inGame in addition to
         * setting the matchId that was returned from the server to request events to.
         */
        socket.on('matchFoundEvent',this.matchFoundEvent);

        /**
         * Listen for logouts, match leave in addition to queue status changes, all of these will affect how this
         * component is rendered.
         */
        venti.on('changeQueueStatus',this.changeQueueStatus);
        venti.on('clientLogout',this.clientLogout);
        venti.on('leaveMatch',this.leaveMatch);
    },

    componentWillUnmount: function(){
        /**
         * Stop listening when this component is unmounted (i.e if we are on the homepage)
         */
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
        /**
         * If the state of this component determines that we are in a game, render the match component with all of the
         * information required to start requesting information and sending events to the server with, if we are
         * not in the game when we need to make sure we render the queue information components to show how many users
         * are currently playing and to allow the user to queue if they are logged in.
         */
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