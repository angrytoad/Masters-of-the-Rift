/** @jsx React.DOM */

var QueueInformation = React.createClass({

    getInitialState: function(){
        return({
            loggedIn:this.props.loggedIn
        });
    },

    componentWillReceiveProps: function(nextProps){
        this.setState({loggedIn:nextProps.loggedIn});
    },

    render: function(){
        return(
            <div>
                {(
                    this.state.loggedIn
                    ? <JoinQueueButton />
                    : <RequireLogin />
                )}
            </div>
        )
    }
})