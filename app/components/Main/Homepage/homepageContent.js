/** @jsx React.DOM */

var HomepageContent = React.createClass({

    componentDidMount: function(){
        setTimeout(function(){
            $('#homepage').fadeToggle(400);
        },300);
    },

    render: function(){
        return(
            <div id="homepage" className="container">
                <div className="row">
                    <HomepageIntro />
                    <Leaderboard />
                </div>
            </div>
        )
    }
})