/** @jsx React.DOM */


/**
 * class    @TeamMember
 *
 * states
 *  - data: the player data that has been sent (from parent)
 *  - number: the number in the rendering list (from parent)
 *
 *  desc    This component is also used when displaying the questions and can change its actions depending on whether it
 *          is displayed as part of a question or as part of the main information panel.
 */
var TeamMember = React.createClass({

    getInitialState: function(){
        return({
            data:this.props.data,
            number:this.props.number
        });
    },

    displayPlayerInformation: function(e){
        /**
         * When a player square is clicked we trigger this event which in turn triggers a venti event that
         * tells all other components listning to display the given player information, because we were
         * passed player specific information from the parent we can send the whole state.data object.
         */
        venti.trigger('displayPlayerInformation',{player:this.state.data});
        $('.square').removeClass('active');
        $(e.target).parents('.square').addClass('active');
    },

    chooseOption: function(e){
        /**
         * If this is being displayed inside a question we want to ensure we trigger
         * checkForComplete form to see if we have now filled out all the questions required to submit our answers.
         */
        var $parent = $(e.target).parents('.question');
        var $children = $parent.find('.square img');
        $children.removeClass('selected');
        $(e.target).addClass('selected');
        venti.trigger('checkForCompleteForm');
    },

    render: function(){
        /**
         * Display the team member
         */
        var imgString = "http://ddragon.leagueoflegends.com/cdn/6.9.1/img/champion/"+this.state.data.champion+".png"
        if(this.props.question){
            return(
                <div className="left center-align">
                    <div className="square no-select">
                        <img className="no-select" src={imgString} data-answer={this.props.participant} onClick={this.chooseOption} />
                    </div>
                </div>
            )
        }else{
            return(
                <div className="left center-align">
                    <div className="square no-select" onClick={this.displayPlayerInformation}>
                        <img className="no-select" src={imgString} />
                    </div>
                </div>
            )
        }
    }
});