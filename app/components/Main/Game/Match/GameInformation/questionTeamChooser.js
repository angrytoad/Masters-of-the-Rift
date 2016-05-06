/** @jsx React.DOM */


var QuestionTeamChooser = React.createClass({

    chooseOption: function(e){
        $(e.target).parents('.team-chooser').children('a').removeClass('selected');
        $(e.target).addClass('selected');
    },

    render: function(){
        return(
            <div className="team-chooser">
                <a className="waves-effect waves-light btn blue darken-1 white-text choice blue-team" onClick={this.chooseOption}>TEAM 1</a>
                <a className="waves-effect waves-light btn red darken-1 white-text choice red-team" onClick={this.chooseOption}>TEAM 2</a>
            </div>
        )
    }

});