/** @jsx React.DOM */


/**
 * class    @GameInformation
 *
 * states
 *  - data: the game data object that was sent by the server (from parent)
 *  - selectSound: the sound to play when a champion is selected
 *
 *  desc    This component handles the rendering of each team, in addition to displaying information about the currently
 *          selected player (if one has been selected)
 */
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
        /**
         * Play a match intro sound
         */
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
        /**
         * When player information has been received, set a new state called player to the player object that was
         * sent to us. Also play the select sound.
         */
        this.state.selectSound.play();
        this.setState({
            player:data.player
        })
    },

    render: function(){
        /**
         * We need to render both teams so we render two TeamRoster components with different information each, in addition
         * if we do have information for this.state.player we want to display this stuff
         */
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