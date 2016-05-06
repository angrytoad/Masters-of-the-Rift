/** @jsx React.DOM */


var TeamBans = React.createClass({

    render: function(){
        if(this.props.bans.length > 0) {
            return (
                <div>
                    <p className="flow-text label">Bans:</p>
                    {Array.apply(null, this.props.bans).map(function (ban, i) {
                        var imgString = "http://ddragon.leagueoflegends.com/cdn/6.9.1/img/champion/"+ban+".png"
                        return (
                            <div className="champion-ban left">
                                <img src={imgString} />
                            </div>
                        );
                    }, this)
                    }
                </div>
            )
        }else{
            return(
                <div></div>
            )
        }
    }

})