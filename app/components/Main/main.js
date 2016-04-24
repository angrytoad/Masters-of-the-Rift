/** @jsx React.DOM */

var Main = React.createClass({

    getInitialState: function(){
        return({
            inGame:false,
        })
    },

    componentDidMount: function(){
        socket.emit('connectionAttemptEvent');
        socket.on('connectedEvent', function (data) {
            console.info('connectedEvent Fired Successfully');
        });


        venti.on('changePlayState',this.changePlayState);
    },

    componentWillUnmount: function(){
        socket.removeListener('connectedEvent')

        venti.off('changePlayState',this.changePlayState);
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

    render: function(){
        return(
            <div>
                <Header />
                {(this.state.inGame ? <GameContent /> : <HomepageContent />)}
            </div>
        )
    }

});