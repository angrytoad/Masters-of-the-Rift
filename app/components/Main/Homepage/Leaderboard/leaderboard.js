/** @jsx React.DOM */


var Leaderboard = React.createClass({

    shareFacebook: function(){
        FB.ui(
            {
                method: 'share',
                href: 'https://developers.facebook.com/docs/'
            }, function(response){});
    },

    shareTwitter: function(){
        var url = 'https://twitter.com/intent/tweet?text=Play%20Masters%20of%20the%20Rift%20at%20----ENTER SITE ADDRESS HERE---->';
        var title = 'Share Masters of the Rift to Twitter!';
        var w = 600;
        var h = 400;

        var left = (screen.width/2)-(w/2);
        var top = (screen.height/2)-(h/2);
        return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
    },

    shareReddit: function(){
        var url = '//www.reddit.com/submit?url=' + encodeURIComponent(window.location);
        var title = 'Share Masters of the Rift to Twitter!';
        var w = 600;
        var h = 400;

        var left = (screen.width/2)-(w/2);
        var top = (screen.height/2)-(h/2);
        return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
    },

    render: function(){
        return(
            <div className="col s5">
                <div id="leaderboard">
                    <h4 className="center-align">
                        <span className="motr-pink">Live</span>
                        <span className="motr-blue">Leaderboards</span>
                    </h4>
                </div>
                <div className="col s12">
                    <p className="center-align flow-text motr-pink share-title">Share the game!</p>
                    <div className="col s4">
                        <button className="col s12 share twitter-share-button waves-effect waves-light btn-large light-blue twitter-share" onClick={this.shareTwitter}>
                            Twitter
                        </button>
                    </div>
                    <div className="col s4">
                        <button className="col s12 share waves-effect waves-light btn-large orange darken-3 reddit-share" onClick={this.shareReddit}>
                            Reddit
                        </button>
                    </div>
                    <div className="col s4">
                        <button className="col s12 share waves-effect waves-light btn-large blue darken-3 facebook-share" onClick={this.shareFacebook}>
                            Facebook
                        </button>
                    </div>
                </div>



            </div>
        )
    }
})