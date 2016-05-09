/** @jsx React.DOM */


/**
 * class    @BackgroundMusicControl
 *
 * states
 *  - muted: whether or not the music is currently muted (from local storage)
 *  - music: the track that is playing in the background (Aurelion Sol's music)
 *  
 *  desc    This handles background music in the game, we know some people find it quite annoying sometimes so
 *          we wanted to make sure that you can mute it if you want to, sounds are not currently mutable
 *          but may be able to be done in a future update.
 */
var BackgroundMusicControl = React.createClass({

    getInitialState: function(){
        return({
            muted:(localStorage.getItem('motr-music-mute') == '1'),
            music: new Howl({
                urls: ['/assets/sounds/background4.mp3'],
                loop: true,
                autoplay:true,
                volume: 0.2
            })
        })
    },

    toggleMute: function(){
        /**
         * Toggles whether the music should or should-not be playing
         */
        if(this.state.muted){
            this.setState({muted:false});
            this.unmuteSound();

        }else{
            this.setState({muted:true});
            this.muteSound();
        }
    },

    muteSound: function() {
        /**
         * Ensure we set local storage when we either mute/unmute
         */
        this.state.music.mute();
        localStorage.setItem('motr-music-mute','1');
    },

    unmuteSound: function(){
        /**
         * Ensure we set local storage when we either mute/unmute
         */
        this.state.music.unmute();
        localStorage.setItem('motr-music-mute','0');
    },

    componentDidMount: function(){

        if(!this.state.muted){
            this.state.music.unmute();
            this.unmuteSound();
            localStorage.setItem('motr-music-mute','0');
        }else {
            this.state.music.mute();
            localStorage.setItem('motr-music-mute', '1');
        }


        /**
         * Listen for Venti events
         */
        venti.on('fadeOutMusic',this.muteSound);
        venti.on('fadeInMusic',this.unmuteSound);
        venti.on('swapTrack',this.swapTrack);
    },

    componentWillUnmount: function(){
        /**
         * Ensure we stop listening for events in the case that this component might be chosen to be unrendered.
         */
        venti.off('fadeOutMusic',this.muteSound);
        venti.off('fadeInMusic',this.unmuteSound);
        venti.off('swapTrack',this.swapTrack);
    },

    swapTrack: function(data){
        /**
         * This is not currently being used but may be utilised in a future update, you will be able to select from
         * a few music tracks eventually
         */
        this.setState({
            music: new Howl({
                urls: ['/assets/sounds/'+data.track],
                loop: data.loop,
                autoplay:true,
                volume: 0
            })
        })
    },

    render: function(){
        return(
            <div className="valign-wrapper background-music-control">
                <div className="valign">
                    <a className="waves-effect waves-light btn blue-grey darken-2" onClick={this.toggleMute}>{(this.state.muted ? 'Unmute Music' : 'Mute Music')}</a>
                </div>
            </div>
        )
    }
})