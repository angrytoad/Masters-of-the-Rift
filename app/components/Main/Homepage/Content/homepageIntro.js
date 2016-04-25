/** @jsx React.DOM */

var HomepageIntro = React.createClass({

    pressedPlay: function(){
        venti.trigger('changePlayState',{playing:true})
    },

    render: function(){
        return(
            <div className="col s7">
                <h4>Welcome</h4>
                <p className="flow-text">
                    This is intro content that will be going onto the homepage, not sure what to put here yet though
                </p>
                <button className="waves-effect waves-light btn-large motr-blue play-button col s12" onClick={this.pressedPlay}>
                    <span className="motr-pink">Play</span>
                </button>
            </div>
        )
    }
})