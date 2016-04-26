/** @jsx React.DOM */

var GameContent = React.createClass({

    getInitialState: function(){
        return({
            loggedIn:this.props.loggedIn,
            summoner:this.props.summoner,
            loginId:this.props.loginId,
            inQueue:false,
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
        this.setState({inQueue:data.inQueue});
    },
    
    clientLogout: function(){
        this.setState({
            inQueue:false
        })
    },

    componentDidMount: function(){
        setTimeout(function(){
            $('#game').fadeToggle(400);
        },300);

        venti.on('changeQueueStatus',this.changeQueueStatus);
        venti.on('clientLogout',this.clientLogout);
    },

    componentWillUnmount: function(){
        venti.off('changeQueueStatus',this.changeQueueStatus);
        venti.off('clientLogout',this.clientLogout);
    },

    render: function(){
        return(
            <div id="game" className="container">
                <button className="waves-effect waves-light btn blue-grey darken-2 faded right" onClick={this.setNotPlaying}>Back</button>
                <h4>Enter the Queue</h4>
                <QueueInformation loggedIn={this.state.loggedIn} inQueue={this.state.inQueue} />
            </div>
        )

    }
})