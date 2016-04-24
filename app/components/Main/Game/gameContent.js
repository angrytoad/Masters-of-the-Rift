/** @jsx React.DOM */

var GameContent = React.createClass({

    setNotPlaying: function(){
        venti.trigger('changePlayState',{playing:false});
    },

    componentDidMount: function(){
        setTimeout(function(){
            $('#game').fadeToggle(400);
        },300);
    },

    render: function(){
        return(
            <div id="game" className="container">
                <h1>Game content</h1>
                <a onClick={this.setNotPlaying}>Click me to stop playing.</a>
            </div>
        )
    }
})