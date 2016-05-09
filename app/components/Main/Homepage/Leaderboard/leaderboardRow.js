/** @jsx React.DOM */


/**
 * class    @LeaderboardRow
 *
 * states
 *  - data: the individual player row data that will be displayed (from parent)
 *
 *  desc    Renders the leaderboard row with the correct information needed to display wins, losses, total score and win
 *          ratio.
 */
var LeaderboardRow = React.createClass({

    getInitialState: function(){
        return({
            data:this.props.rowData
        })
    },

    componentWillReceiveProps: function(nextProps){
        this.setState({
            data:nextProps.rowData
        })
    },

    render: function(){
        return(
            <tr>
                <td className="motr-pink">{this.state.data.loginId}</td>
                <td className="center-align">{this.state.data.gamesWon}</td>
                <td className="center-align">{(this.state.data.totalGames - this.state.data.gamesWon)}</td>
                <td className="center-align motr-blue">{this.state.data.totalScore}</td>
                <td className="center-align">{((100/this.state.data.totalGames)*this.state.data.gamesWon).toFixed(2)}%</td>
            </tr>
        )
    },

});