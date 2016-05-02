/** @jsx React.DOM */


var TeamMember = React.createClass({

    getInitialState: function(){
        return({
            data:this.props.data,
            number:this.props.number
        });
    },

    render: function(){
        return(
            <div className="left center-align">
                <div className="square">
                    {this.state.number}
                </div>
            </div>
        )
    }
});