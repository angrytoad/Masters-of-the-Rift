/** @jsx React.DOM */


var GameInformation = React.createClass({

    getInitialState: function(){
        return({
            data: this.props.data
        });
    },

    componentDidMount: function(){
        console.log(this.state.data);
        var start = new Howl({
            urls: ['/assets/sounds/fight.mp3'],
            autoplay:true,
            volume: 0.6
        })
    },

    render: function(){
        return(
            <div>
                <div className="row">
                    <TeamRoster data={this.state.data.blue} name="Team 1" />
                    <TeamRoster data={this.state.data.red} name="Team 2" />
                </div>
            </div>
        )
    }
})