/** @jsx React.DOM */

var Main = React.createClass({

    componentDidMount: function(){
        socket.emit('connectionAttemptEvent');
        socket.on('connectedEvent', function (data) {
            console.info('connectedEvent Fired Successfully');
        });

    },

    componentWillUnmount: function(){
        socket.removeListener('connectedEvent')
    },

    render: function(){
        return(
            <div>
                <h1>This works dude!</h1>
            </div>
        )
    }

});