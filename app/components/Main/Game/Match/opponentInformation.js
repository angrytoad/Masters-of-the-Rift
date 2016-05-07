/** @jsx React.DOM */


var OpponentInformation = React.createClass({

    getInitialState: function(){
        return({
            opponentsAnswers: [0,0,0,0,0]
        })
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

