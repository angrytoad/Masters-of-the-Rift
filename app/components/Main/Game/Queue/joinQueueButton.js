/** @jsx React.DOM */


/**
 * class    @JoinQueueButton
 *
 * desc     This component will make a join queue or leave queue request depending on if the users is currently in the
 *          queue.
 */
var JoinQueueButton = React.createClass({

    requestToJoinQueue: function(){
        socket.emit('joinQueueRequest',{session:getSession()});
    },

    requestToLeaveQueue: function(){
        socket.emit('leaveQueueRequest',{session:getSession()});
    },
    
    changeQueueStatus: function(data){
        venti.trigger('changeQueueStatus',{inQueue:data.inQueue})
    },

    componentDidMount: function(){
        socket.on('joinQueueRequestEvent',this.changeQueueStatus);
        socket.on('leaveQueueRequestEvent', this.changeQueueStatus);
    },

    componentWillUnmount: function(){
        socket.removeListener('joinQueueRequestEvent');
        socket.removeListener('leaveQueueRequestEvent');
    },

    render: function(){
        return(
            <div className="center-align">

                    {(
                        this.props.inQueue
                        ? <button className="waves-effect waves-light btn-large join-queue-button" onClick={this.requestToLeaveQueue}><span className="motr-pink" >Leave Queue</span></button>
                        : <button className="waves-effect waves-light btn-large join-queue-button" onClick={this.requestToJoinQueue}><span className="motr-pink" >Join Queue</span></button>
                    )}


            </div>
        )
    }
})