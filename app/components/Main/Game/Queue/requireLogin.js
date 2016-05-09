/** @jsx React.DOM */

/**
 * class    @RequireLogin
 *
 * desc     Tell the user that they must login in order to queue.
 */
var RequireLogin = React.createClass({
    render: function(){
        return(
            <div className="center-align">
                <h4 className="red-text">You cannot queue unless you login.</h4>
            </div>
        )
    }
})