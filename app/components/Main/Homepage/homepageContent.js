/** @jsx React.DOM */

var HomepageContent = React.createClass({

    componentDidMount: function(){
        setTimeout(function(){
            $('#homepage').fadeToggle(400);
        },300);
    },

    setPlaying: function(){
        venti.trigger('changePlayState',{playing:true})
    },

    render: function(){
        return(
            <div id="homepage" className="container">
                <div className="row">
                    <HomepageIntro />
                    <Leaderboard />
                </div>
                <a onClick={this.setPlaying}>Press me to play.</a>
            </div>
        )
    }
})