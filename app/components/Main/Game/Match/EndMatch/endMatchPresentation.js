/** @jsx React.DOM */


var EndMatchPresentation = React.createClass({

    getInitialState:function(){
        return({
            scores:this.props.scores,
            game:this.props.game,
            matchId:this.props.matchId,
            player:this.props.player
        })
    },

    componentWillReceiveProps:function(nextProps){
        this.setState({
            scores:nextProps.scores,
            game:nextProps.game,
            matchId:nextProps.matchId,
            player:nextProps.player
        })
    },

    componentDidMount: function(){

    },

    componentWillUnmount:function(){

    },

    render: function(){
        
        return(
            <div>
                End Match Presentation Stuff
            </div>
        )
    }

})