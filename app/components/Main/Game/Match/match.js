/** @jsx React.DOM */

var Match = React.createClass({

    getInitialState: function(){
        return({
            loggedIn:this.props.loggedIn,
            summoner:this.props.summoner,
            loginId:this.props.loginId
        })
    },

    componentWillReceiveProps: function(nextProps){
        this.setState({
            loggedIn:nextProps.loggedIn,
            summoner:nextProps.summoner,
            loginId:nextProps.loginId
        });
    },

    componentDidMount: function(){

    },

    componentWillUnmount: function(){

    },

    render: function(){
        return(
            <div>
                <p className="flow-text">
                    Isn't this a fine gaammme?
                </p>
            </div>
        )
    }
})