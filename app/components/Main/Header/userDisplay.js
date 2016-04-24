/** @jsx React.DOM */

var UserDisplay = React.createClass({

    getInitialState: function(){
        return({
            loggedIn:this.props.loggedIn,
            summoner:this.props.summoner,
            loginId:this.props.loginId,
        })
    },

    componentWillReceiveProps: function(nextProps) {
        this.setState({
            loggedIn: nextProps.loggedIn,
            summoner: nextProps.summoner,
            loginId: nextProps.loginId
        });
    },

    render: function(){
        return(
            <div id="user-display" className="header-secondary col s6 right-align">
                <h4>{this.state.summoner} <i>({this.state.loginId})</i></h4>
            </div>
        )
    }
})