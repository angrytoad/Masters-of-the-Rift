/** @jsx React.DOM */


/**
 * class    @HomepageIntro
 *
 * states
 *  - showingTechnical: Are we showing technical information or not?
 */
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
        /**
         * Do we want to show information that is technical/non-technical to players
         * all of the homepage intro content goes in here.
         */
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
                              This game is an entry by Tom Freeborough and Alex Salam into the <a href="https://developer.riotgames.com/discussion/announcements/show/eoq3tZd1" target="_blank">Riot Games 2016 API Challenge.</a> To play all you need to do
                              is register and login, since this is in the early phases you might want to grab a friend though! All of the code for this project
                              is available on our <a href="https://github.com/angrytoad/Masters-of-the-Rift" target="_blank">Github.</a> Alternatively, if you'd like to read more
                              in depth about the technologies and techniques used in this project, please <a href="javascript:void(0)" onClick={this.loadTechnicalInformation}>click here.</a>
                          </p>

                          <button className="waves-effect waves-light btn-large motr-blue play-button col s12" onClick={this.pressedPlay}>
                              <span className="motr-pink">Play</span>
                          </button>

                          <p className="disclaimer">
                              Masters of the Rift isn’t endorsed by Riot Games and doesn’t reflect the views or opinions
                              of Riot Games or anyone officially involved in producing or managing League of Legends.
                              League of Legends and Riot Games are trademarks or registered trademarks of Riot Games,
                              Inc. League of Legends © Riot Games, Inc.
                          </p>
                      </div>



                    
                    
                )}
            </div>
        )
    }
})