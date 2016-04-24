/** @jsx React.DOM */

var Header = React.createClass({

    getInitialState: function(){
        return({
            loggedIn: this.props.loggedIn,
            summoner:this.props.summoner,
            loginId:this.props.loginId
        })
    },

    componentDidMount: function(){
        $('#header').slideToggle(400);
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
            <div id="header" className="row">
                <div className="col s6 logo-title">
                    <BackgroundMusicControl />
                    <div className="logo">
                        <img title="Masters of the Rift" src="/assets/images/logo.png" />
                    </div>
                    <div className="title no-select">
                        <span className="masters">Masters</span> of the <span className="rift">Rift</span>
                    </div>
                </div>
                {(
                    this.state.loggedIn
                    ? <UserDisplay loggedIn={this.state.loggedIn} summoner={this.state.summoner} loginId={this.state.loginId} />
                    : <LoginForm />
                )}
            </div>
        )
    }
})