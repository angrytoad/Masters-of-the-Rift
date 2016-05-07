/** @jsx React.DOM */

var Checkbox = React.createClass({

    render: function(){
        if(this.props.disabled) {
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