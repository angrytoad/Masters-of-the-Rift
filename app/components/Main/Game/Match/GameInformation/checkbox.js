/** @jsx React.DOM */

/**
 * class    @Checkbox
 *
 * states
 *  - disabled: Determine whether or not the checkbox should be ticker/unticked
 *
 *  desc    Shows either a checked or unchecked box depending on disabled state
 */
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