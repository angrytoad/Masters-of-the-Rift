/** @jsx React.DOM */


var EndMatchPresentation = React.createClass({

    getInitialState:function(){
        return({
            scores:this.props.scores
        })
    },

    componentWillReceiveProps:function(nextProps){
        this.setState({
            scores:nextProps.scores
        })
    },

    render: function(){
        
        return(
            <div>
                End Match Presentation Stuff
            </div>
        )
    }

})