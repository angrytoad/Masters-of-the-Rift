/** @jsx React.DOM */


/**
 * class    @ShareScreen
 *
 * states
 *  - loginId: the loginId of the current user (from parent)
 *
 *  desc    This component handles some social media sharing stuff as well as allowing the user to leave the match
 */
var ShareScreen = React.createClass({

    shareFacebook: function(){
        FB.ui(
            {
                method: 'share',
                href: 'https://developers.facebook.com/docs/'
            }, function(response){});
    },

    shareTwitter: function(){
        var url = 'https://twitter.com/intent/tweet?text=I ('+this.state.loginId+') just played a game in Masters of the Rift! - http://dedivps-47985.dedicloud.co.uk/';
        var title = 'Share Masters of the Rift to Twitter!';
        var w = 600;
        var h = 400;

        var left = (screen.width/2)-(w/2);
        var top = (screen.height/2)-(h/2);
        return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
    },

    shareReddit: function(){
        var url = '//www.reddit.com/submit?url=' + encodeURIComponent(window.location) + '&title=Have%20you%20guys%20checked%20out%20Masters%20of%20the%20Rift%20yet?';
        var title = 'Share Masters of the Rift to Reddit!';
        var w = 600;
        var h = 400;

        var left = (screen.width/2)-(w/2);
        var top = (screen.height/2)-(h/2);
        return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
    },

    leaveMatch: function(){
        console.log('LEAVING MATCH');
        $('.yes-game').slideUp(500,function(){
            venti.trigger('leaveMatch');
        });
    },

    getInitialState: function(){
        return({
            loginId:this.props.loginId
        })
    },

    componentDidMount: function(){
        $('.yes-game').slideToggle(1000);
    },

    render: function(){
        return(
            <div className="row">
                <p className="center-align flow-text motr-pink share-title">Share the game!</p>
                <div className="col s12">
                    <p className="flow-text motr-pink center-align">
                        If you had fun why not share our game with your friends?
                    </p>
                </div>
                <div className="col s6">
                    <button className="col s12 share twitter-share-button waves-effect waves-light btn-large light-blue twitter-share" onClick={this.shareTwitter}>
                        Twitter
                    </button>
                </div>
                <div className="col s6">
                    <button className="col s12 share waves-effect waves-light btn-large orange darken-3 reddit-share" onClick={this.shareReddit}>
                        Reddit
                    </button>
                </div>
                <div className="col s12">
                    <p className="flow-text motr-blue">
                        Thanks for playing the game, this game was created as part of the Riot Games API Challenge 2016
                        so if there are a few bugs, we're really sorry. If you would like to report a bug please get in touch
                        with us via Github.
                    </p>
                </div>
                <div className="col s12">
                    <button className="col s12 share waves-effect waves-light btn-large blue darken-3 facebook-share" onClick={this.leaveMatch}>
                        Leave match
                    </button>
                </div>
            </div>
        )
    }

})