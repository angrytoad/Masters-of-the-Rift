/** @jsx React.DOM */

var QueueInformation = React.createClass({

    getInitialState: function(){
        return({
            loggedIn:this.props.loggedIn,
            inQueue:10,
            inMatch:10,
        });
    },

    componentWillReceiveProps: function(nextProps){
        this.setState({loggedIn:nextProps.loggedIn});
    },

    componentDidMount: function(){
        socket.emit('requestQueueInformation');

        socket.on('requestQueueInformationEvent',this.updateQueueInformation);
    },

    componentWillUnmount: function(){
        socket.emit('requestLeaveQueueInformation');

        socket.removeListener('requestQueueInformationEvent');
    },

    updateQueueInformation: function(data){
        console.log('queue information received!');
        this.setState({inQueue:data.inQueue,inMatch:data.inMatch});
    },

    render: function(){
        return(
            <div>
                <div>
                    <p className="flow-text">
                        There are currently <b className="motr-pink">{this.state.inQueue}</b> people in the queue and <b className="motr-blue">{this.state.inMatch}</b> people in a match.
                    </p>
                </div>
                {(
                    this.state.loggedIn
                    ? <JoinQueueButton />
                    : <RequireLogin />
                )}
            </div>
        )
    }
})