/** @jsx React.DOM */

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
        console.log(this.state.data);
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