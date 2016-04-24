/** @jsx React.DOM */

var BackgroundMusicControl = React.createClass({

    getInitialState: function(){
        return({
            muted:(localStorage.getItem('motr-music-mute') == '1'),
            music: new Howl({
                urls: ['/assets/sounds/background.mp3'],
                loop: true,
                autoplay:true,
                volume: 0.2
            })
        })
    },

    toggleMute: function(){
        if(this.state.muted){
            this.setState({muted:false});
            this.unmuteSound();

        }else{
            this.setState({muted:true});
            this.muteSound();
        }
    },

    muteSound: function() {
        this.state.music.mute();
        localStorage.setItem('motr-music-mute','1');
    },

    unmuteSound: function(){
        this.state.music.unmute();
        localStorage.setItem('motr-music-mute','0');
    },

    componentDidMount: function(){
        if(!this.state.muted){
            this.state.music.unmute();
            localStorage.setItem('motr-music-mute','0');
        }else{
            this.state.music.mute();
            localStorage.setItem('motr-music-mute','1');
        }
    },

    render: function(){
        return(
            <div className="col s3 valign-wrapper background-music-control">
                <div className="valign">
                    <a className="waves-effect waves-light btn blue-grey darken-2" onClick={this.toggleMute}>{(this.state.muted ? 'Unmute Music' : 'Mute Music')}</a>
                </div>
            </div>
        )
    }
})