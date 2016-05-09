/** @jsx React.DOM */

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
                            <th>W</th>
                            <th>L</th>
                            <th>Pts</th>
                            <th>W %</th>
                        </tr>
                    </thead>
                    <tbody>
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