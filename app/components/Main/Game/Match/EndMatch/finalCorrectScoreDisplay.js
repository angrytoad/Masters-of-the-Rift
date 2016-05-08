/** @jsx React.DOM */

var FinalCorrectScoreDisplay = React.createClass({

    getInitialState: function(){
        return({
            score:this.props.score,
        })
    },

    componentWillReceiveProps: function(nextProps){
        this.setState({
            score:nextProps.score,
        })
    },

    componentDidMount: function(){
        var counter = 0;
    },

    render: function(){
        return(
            <div className="col s4">
                Answers go here!
            </div>
        )
    }

})