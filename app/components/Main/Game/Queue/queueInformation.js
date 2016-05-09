/** @jsx React.DOM */


/**
 * class    @QueueInformation
 *
 * states
 *  - loggedIn: if the user is currently logged in (from parent)
 *  - amountInQueue: how many users are currently in the queue
 *  - amountInMatch: how many users are currently in a match
 *  - inQueue: is the user currently in a queue
 *
 *  desc    This component keeps updated with how many players are currently in the queue or in a game, in addition it
 *          also handles everything related to joining and leaving the queue
 */
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

        /**
         * This listenes for an event from the server is fired whenever users join or leave the queue, in addition
         * to when a match is made, this will call the method updateQueueInformation
         */
        socket.on('requestQueueInformationEvent',this.updateQueueInformation);
    },

    componentWillUnmount: function(){
        socket.emit('requestLeaveQueueInformation');

        socket.removeListener('requestQueueInformationEvent');
    },

    updateQueueInformation: function(data){
        /**
         * Update queue information will update the amount of users who are currently in the queue or in a game.
         */
        this.setState({
            amountInQueue:data.inQueue,
            amountInMatch:data.inMatch
        });
    },

    render: function(){
        /**
         * If the user is logged in render the JoinQueueButton, else render the RequireLogin Text
         */
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