/** @jsx React.DOM */


var OpponentInformation = React.createClass({

    getInitialState: function(){
        return({
            opponentsAnswers: [0,0,0,0,0]
        })
    },

    componentDidMount: function(){
        socket.on('answerCountEvent',this.answerCountEvent);
    },

    componentWillUnmount: function(){
        socket.removeListener('answerCountEvent',this.answerCountEvent);
    },

    answerCountEvent: function(data){
        var answerArray = [];
        for(var i=0; i<data.count;i++){
            answerArray[i] = 1;
        }
        this.setState({opponentsAnswers:answerArray});
    },

    render: function(){
        return(
            <div className="center-align opponent-answers">
                <p><b>Your opponents progress</b></p>
                {Array.apply(null, this.state.opponentsAnswers).map(function(item, i){
                    var idString = 'filled-in-box-'+i;
                    if(item === 0){
                        return (
                            <Checkbox disabled="true" identifier={idString} />
                        );
                    }else{
                        return (
                            <Checkbox disabled="false" identifier={idString} />
                        );
                    }

                }, this)}
            </div>
        )
    }
})

