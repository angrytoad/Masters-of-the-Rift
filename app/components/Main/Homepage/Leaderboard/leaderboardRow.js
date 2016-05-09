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
        return(
            <tr>
                <td>1</td>
                <td>2</td>
                <td>3</td>
                <td>4</td>
                <td>5</td>
            </tr>
        )
    },

});