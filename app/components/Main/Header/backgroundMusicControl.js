/** @jsx React.DOM */

var BackgroundMusicControl = React.createClass({

    getInitialState: function(){
        return({
            muted:(localStorage.getItem('motr-music-mute') == '1'),
            music: new Howl({
                urls: ['/assets/sounds/background2.mp3'],
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
            this.unmuteSound();
            localStorage.setItem('motr-music-mute','0');
        }else {
            this.state.music.mute();
            localStorage.setItem('motr-music-mute', '1');
        }



        venti.on('fadeOutMusic',this.muteSound);
        venti.on('fadeInMusic',this.unmuteSound);
        venti.on('swapTrack',this.swapTrack);
    },

    componentWillUnmount: function(){
        venti.off('fadeOutMusic',this.muteSound);
        venti.off('fadeInMusic',this.unmuteSound);
        venti.off('swapTrack',this.swapTrack);
    },

    swapTrack: function(data){
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
            <div className="col s3 valign-wrapper background-music-control">
                <div className="valign">
                    <a className="waves-effect waves-light btn blue-grey darken-2" onClick={this.toggleMute}>{(this.state.muted ? 'Unmute Music' : 'Mute Music')}</a>
                </div>
            </div>
        )
    }
})