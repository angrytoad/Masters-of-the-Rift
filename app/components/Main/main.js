/** @jsx React.DOM */


/**
 * class    @Main
 *
 * states
 *  - inGame: whether or not the player is currently in a game
 *  - loggedIn: whether or not the player is currently logged in
 *  - summoner: The summoner name of the player if they are logged in
 *  - loginId: The unique ID of the logged in player.
 *
 * desc     This class renders everything else required to create the webpage, listens for events
 *          such as authentication errors, and connection events, also listens for local events
 *          such as changePlayState and clientLogout
 */
var Main = React.createClass({

    getInitialState: function(){
        return({
            inGame:false,
            loggedIn:false,
            summoner:null,
            loginId:null
        })
    },

    componentDidMount: function(){
        socket.emit('connectionAttemptEvent');
        socket.on('connectedEvent', function (data) {
            /**
             *  Test function to ensure that we have a socket connection to the server.
             */
            console.info('connectedEvent Fired Successfully: We have a connection to the socket server');
        });
        socket.on('authErrorEvent',this.authErrorEvent);


        /**
         * Venti listeners that modify states in the component
         */
        venti.on('changePlayState',this.changePlayState);
        venti.on('changeLoggedState',this.changeLoggedState);
        venti.on('clientLogout',this.authErrorEvent);

    },

    componentWillUnmount: function(){
        /**
         * In the event that we would ever want to unmount this component, we need to make sure
         * we remove any listeners so that events do not trigger twice and we're unsubscribed
         * from certain information from the server.
         */
        socket.removeListener('connectedEvent');
        socket.removeListener('authErrorEvent');

        venti.off('changePlayState',this.changePlayState);
        venti.off('changeLoggedState',this.changeLoggedState);
        venti.off('clientLogout',this.authErrorEvent);
    },

    authErrorEvent: function(data){
        /**
         * If we failed to authenticate the user, we want to make sure we destroy any session cookies that might
         * be present in addition to setting the states on this component to ensure the correct
         * things are rendered on the page.
         */
        console.log(getSession());
        destroySession();
        this.setState({
            loggedIn:false,
            summoner:null,
            loginId:null
        });
        /**
         * Also trigger a venti authErrorEvent so we can quickly tell the header component that it needs to do something
         */
        console.log(data);
        venti.trigger('authErrorEvent');
    },

    changePlayState: function(data){
        /**
         * Slides up and sets the state to render a different component for handling queues and games.
         */
        if(data.playing !== this.state.inGame) {
            $('#homepage').slideUp(400);
            $('#game').slideUp(400);
            var that = this;
            setTimeout(function () {
                that.setState({inGame: data.playing});
            }, 400);
        }

    },

    changeLoggedState: function(data){
        /**
         * Takes data object given and sets the state of this component to the various things needed to display
         * who is currently logged in.
         */
        this.setState({
            loggedIn:data.loggedIn,
            summoner:data.summoner,
            loginId:data.loginId
        });
    },

    render: function(){
        /**
         * Render the component, if in a game render GameContent instead of HomepageContent. Header should always render
         * regardless of current game state.
         */
        return(
            <div>
                <Header loggedIn={this.state.loggedIn} summoner={this.state.summoner} loginId={this.state.loginId} />
                {(
                    this.state.inGame
                    ? <GameContent loggedIn={this.state.loggedIn} summoner={this.state.summoner} loginId={this.state.loginId} />
                    : <HomepageContent />
                )}
            </div>
        )
    }

});