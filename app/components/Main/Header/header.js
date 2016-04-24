/** @jsx React.DOM */

var Header = React.createClass({

    getInitialState: function(){
        return({
            loggedIn: this.props.loggedIn
        })
    },

    render: function(){
        return(
            <div id="header" className="row">
                <div className="logo-title" className="col s6">
                    <BackgroundMusicControl />
                    <div className="logo">
                        <img title="Masters of the Rift" src="/assets/images/logo.png" />
                    </div>
                    <div className="title">
                        Masters of the Rift
                    </div>
                </div>
                {(
                    this.state.loggedIn
                    ? <UserDisplay loggedIn={this.state.loggedIn} />
                    : <LoginForm />
                )}
            </div>
        )
    }
})