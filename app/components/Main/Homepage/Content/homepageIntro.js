/** @jsx React.DOM */

var HomepageIntro = React.createClass({

    getInitialState: function(){
        return({
            showingTechnical:false
        })
    },

    pressedPlay: function(){
        venti.trigger('changePlayState',{playing:true})
    },

    loadTechnicalInformation: function(){
        this.setState({showingTechnical:true});
    },

    loadNormalInformation: function(){
        this.setState({showingTechnical:false});
    },

    render: function(){
        return(
            <div className="col s7">
                {(
                    this.state.showingTechnical
                    ?
                        <div>
                            <button className="waves-effect waves-light btn blue-grey darken-2 faded right" onClick={this.loadNormalInformation}>Normal Stuff</button>
                            <h4>The Project</h4>
                        </div>
                    :
                      <div>
                          <button className="waves-effect waves-light btn blue-grey darken-2 faded right" onClick={this.loadTechnicalInformation}>Technical Stuff</button>
                          <h4>Welcome</h4>
                          <p className="flow-text">
                              Welcome to Masters of the Rift, a game that tests your knowledge, speed and luck against other online opponents!
                          </p>
                          <p className="flow-text">
                              This game is an entry by Tom Freeborough and Alex Salam into the Riot Games 2016 API Challenge. To play all you need to do
                              is register and login, since this is in the early phases you might want to grab a friend though! All of the code for this project
                              is available on our <a href="https://github.com/angrytoad/Masters-of-the-Rift">Github.</a> Alternatively, if you'd like to read more
                              in depth about the technologies and techniques used in this project, please <a href="#" onClick={this.loadTechnicalInformation}>click here.</a>
                          </p>
                          <button className="waves-effect waves-light btn-large motr-blue play-button col s12" onClick={this.pressedPlay}>
                              <span className="motr-pink">Play</span>
                          </button>
                      </div>
                    
                    
                    
                    
                    
                )}
            </div>
        )
    }
})