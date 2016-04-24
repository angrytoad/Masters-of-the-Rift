/** @jsx React.DOM */

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
            console.info('connectedEvent Fired Successfully');
        });


        venti.on('changePlayState',this.changePlayState);
        venti.on('changeLoggedState',this.changeLoggedState);
    },

    componentWillUnmount: function(){
        socket.removeListener('connectedEvent')

        venti.off('changePlayState',this.changePlayState);
        venti.off('changeLoggedState',this.changeLoggedState);
    },

    changePlayState: function(data){
        $('#homepage').slideUp(400);
        $('#game').slideUp(400);
        var that = this;
        setTimeout(function(){
            that.setState({inGame:data.playing});
        },400);

    },

    changeLoggedState: function(data){
        this.setState({loggedIn:data.loggedIn,summoner:data.summoner,loginId:data.loginId});
    },

    render: function(){
        console.log(this.state.loggedIn);
        return(
            <div>
                <Header loggedIn={this.state.loggedIn} summoner={this.state.summoner} loginId={this.state.loginId} />
                {(this.state.inGame ? <GameContent /> : <HomepageContent />)}
            </div>
        )
    }

});