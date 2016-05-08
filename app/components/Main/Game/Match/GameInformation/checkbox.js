/** @jsx React.DOM */

var Checkbox = React.createClass({

    getInitialState: function(){
        return({
            disabled:this.props.disabled
        })
    },

    componentWillReceiveProps: function(nextProps){
        this.setState({
            disabled:nextProps.disabled
        })
    },

    render: function(){
        if(this.state.disabled) {
            return (
                <div className="checkbox">
                    <img src="/assets/images/checkbox_off.png" />
                </div>
            )
        }else{
            return (
                <div className="checkbox">
                    <img src="/assets/images/checkbox_on.png" />
                </div>
            )
        }
    }

})