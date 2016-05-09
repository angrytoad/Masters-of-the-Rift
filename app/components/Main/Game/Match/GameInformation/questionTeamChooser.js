/** @jsx React.DOM */


/**
 * class    @QuestionTeamChooser
 *
 * desc     Renders a choice option between either the 1st or 2nd team
 */
var QuestionTeamChooser = React.createClass({

    chooseOption: function(e){
        $(e.target).parents('.team-chooser').children('a').removeClass('selected');
        $(e.target).addClass('selected');
        venti.trigger('checkForCompleteForm');
    },

    render: function(){
        return(
            <div className="team-chooser">
                <a className="waves-effect waves-light btn blue darken-1 white-text choice blue-team" data-answer="blue" onClick={this.chooseOption}>TEAM 1</a>
                <a className="waves-effect waves-light btn red darken-1 white-text choice red-team" data-answer="red" onClick={this.chooseOption}>TEAM 2</a>
            </div>
        )
    }

});