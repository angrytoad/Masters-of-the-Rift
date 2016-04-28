/** @jsx React.DOM */

var BackgroundMusicControl = React.createClass({

    getInitialState: function(){
        return({
            muted:(localStorage.getItem('motr-music-mute') == '1'),
            music: new Howl({
                urls: ['/assets/sounds/background2.mp3'],
                loop: true,
                volume: 0
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
        this.fadeOut({volume:0,override:true});
        localStorage.setItem('motr-music-mute','1');
    },

    unmuteSound: function(){
        this.fadeIn({volume:0.2,override:true});
        localStorage.setItem('motr-music-mute','0');
    },

    componentDidMount: function(){

        this.state.music.play();


        if(!this.state.muted){
            this.state.music.unmute();
            this.fadeIn({volume:0.2,override:true});
            localStorage.setItem('motr-music-mute','0');
        }else {
            this.state.music.mute();
            localStorage.setItem('motr-music-mute', '1');
        }



        venti.on('fadeOutMusic',this.fadeOut);
        venti.on('fadeInMusic',this.fadeIn);
        venti.on('swapTrack',this.swapTrack);
    },

    componentWillUnmount: function(){
        venti.off('fadeOutMusic',this.fadeOut);
        venti.off('fadeInMusic',this.fadeIn);
        venti.off('swapTrack',this.swapTrack);
    },

    fadeOut: function(data){
        if(!this.state.muted || data.override) {
            this.state.music.fadeOut(data.volume, 1000);
        }
    },

    fadeIn: function(data){
        this.state.music.play();
        if(!this.state.muted || data.override) {
            this.state.music.fadeIn(data.volume, 1000);
        }else{
            console.log('muting music from fade in');
            this.state.music.mute();
        }
    },

    swapTrack: function(data){
        this.setState({
            music: new Howl({
                urls: ['/assets/sounds/'+data.track],
                loop: true,
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