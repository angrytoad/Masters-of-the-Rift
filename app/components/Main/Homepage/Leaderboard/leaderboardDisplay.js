/** @jsx React.DOM */


/**
 * class    @LeaderboardDisplay
 * 
 * states
 *  - leaderboard: records of the top 25 players (from parent)
 *  
 *  desc    This component will render the top players in terms of score out into the leaderboard component 
 */
var LeaderboardDisplay = React.createClass({

    getInitialState:function(){
        return({
            leaderboard:this.props.leaderboard
        });
    },

    componentWillReceiveProps: function(nextProps){
        this.setState({
            leaderboard:nextProps.leaderboard
        })
    },

    render: function(){
        return(
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Summoner</th>
                            <th className="center-align">W</th>
                            <th className="center-align">L</th>
                            <th className="center-align">Pts</th>
                            <th className="center-align">W %</th>
                        </tr>
                    </thead>
                    <tbody className="leaderboard-rows">
                        {Array.apply(null, this.state.leaderboard).map(function(item, i){
                            return (
                                <LeaderboardRow rowData={item} />
                            );
                        }, this)}
                    </tbody>
                </table>
            </div>
        )
    }

});