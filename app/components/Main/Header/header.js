/** @jsx React.DOM */


/**
 * class    @Header
 * 
 * states   
 *  - loggedIn: Is somebody already logged in? (from parent)
 *  - summoner: The summoner name of the user (from parent)
 *  - loginId: The unique ID of the user (from parent)
 *  
 *  desc    This class displays both the logo and either the user display or the login form depending on whether
 *          the loggedIn state is set to true. This also render the BackgroundMusicControl component which
 *          handles the playing of background music, this is mutable as seen in the bottom right of
 *          your browser screen
 */
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

        /**
         * If a session is found to exist (a session cookie), set the user to logged in so we render UserDisplay
         */
        (sessionExists() ? this.setState({loggedIn:true}) : this.setState({loggedIn:false}));
    },

    componentWillReceiveProps: function(nextProps) {
        /**
         * If props in parent change, update this component also
         */
        this.setState({
            loggedIn: nextProps.loggedIn,
            summoner: nextProps.summoner,
            loginId: nextProps.loginId
        });
    },

    render: function(){
        /**
         * If loggedIn = true then render the user display, otherwise we want to show the user the login/register form.
         */
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