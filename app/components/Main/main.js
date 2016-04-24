/** @jsx React.DOM */

var Main = React.createClass({

    getInitialState: function(){
        return({
            inGame:false,
            loggedIn:false
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
        console.log(data);
        $('#homepage').slideUp(400);
        $('#game').slideUp(400);
        var that = this;
        setTimeout(function(){
            that.setState({inGame:data.playing});
        },400);

    },

    changeLoggedState: function(data){
        this.setState({loggedIn:data.loggedIn});
    },

    render: function(){
        return(
            <div>
                <Header loggedIn={this.state.loggedIn} />
                {(this.state.inGame ? <GameContent /> : <HomepageContent />)}
            </div>
        )
    }

});