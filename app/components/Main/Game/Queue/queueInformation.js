/** @jsx React.DOM */

var QueueInformation = React.createClass({

    getInitialState: function(){
        return({
            loggedIn:this.props.loggedIn,
            amountInQueue:0,
            amountInMatch:0,
            inQueue:this.props.inQueue
        });
    },

    componentWillReceiveProps: function(nextProps){
        this.setState({
            loggedIn:nextProps.loggedIn,
            inQueue:nextProps.inQueue
        });
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
        this.setState({
            amountInQueue:data.inQueue,
            amountInMatch:data.inMatch
        });
    },

    render: function(){
        return(
            <div>
                <div>
                    <p className="flow-text">
                        There are currently <b className="motr-pink">{this.state.amountInQueue}</b> people in the queue and <b className="motr-blue">{this.state.amountInMatch}</b> people in a match.
                    </p>
                </div>
                {(
                    this.state.loggedIn
                    ? <JoinQueueButton inQueue={this.state.inQueue} />
                    : <RequireLogin />
                )}
            </div>
        )
    }
})