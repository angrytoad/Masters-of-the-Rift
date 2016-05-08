/** @jsx React.DOM */


var TeamMember = React.createClass({

    getInitialState: function(){
        return({
            data:this.props.data,
            number:this.props.number
        });
    },

    displayPlayerInformation: function(e){
        venti.trigger('displayPlayerInformation',{player:this.state.data});
        $('.square').removeClass('active');
        $(e.target).parents('.square').addClass('active');
    },

    chooseOption: function(e){
        var $parent = $(e.target).parents('.question');
        var $children = $parent.find('.square img');
        $children.removeClass('selected');
        $(e.target).addClass('selected');
        venti.trigger('checkForCompleteForm');
    },

    render: function(){
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