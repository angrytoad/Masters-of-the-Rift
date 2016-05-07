/** @jsx React.DOM */


var GameInformation = React.createClass({

    getInitialState: function(){
        return({
            data: this.props.data,
            selectSound: new Howl({
                urls: ['/assets/sounds/selectChampion.mp3'],
                volume: 0.6
            })
        });
    },

    componentDidMount: function(){
        var start = new Howl({
            urls: ['/assets/sounds/fight.mp3'],
            autoplay:true,
            volume: 0.6
        });

        venti.on('displayPlayerInformation',this.displayPlayerInformation);
    },

    componentWillUnmount: function(){
        venti.off('displayPlayerInformation',this.displayPlayerInformation);
    },

    displayPlayerInformation: function(data){
        this.state.selectSound.play();
        this.setState({
            player:data.player
        })
    },

    render: function(){
        return(
            <div>
                <div className="row">
                    <TeamRoster data={this.state.data.playerDetails.teams.blue} game={this.state.data.gameData.blue} name="Team 1" classToGive="blue-team" />
                    <TeamRoster data={this.state.data.playerDetails.teams.red} game={this.state.data.gameData.red} name="Team 2" classToGive="red-team" />
                </div>
                {(
                    typeof this.state.player !== 'undefined'
                        ?
                        <div className="row">
                            <SelectedChampion player={this.state.player} />
                        </div>
                        :
                        ''
                )}
            </div>
        )
    }
})