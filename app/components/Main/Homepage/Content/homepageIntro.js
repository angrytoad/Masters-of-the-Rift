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
                        <div className="technical-stuff">
                            <button className="waves-effect waves-light btn blue-grey darken-2 faded right" onClick={this.loadNormalInformation}>Normal Stuff</button>
                            <h4>The Project</h4>
                            <p className="flow-text motr-pink center-align">
                                <b>
                                This is just a brief rundown of the project, for a full write-up please go <a target="_blank" href="https://docs.google.com/document/d/1OQTJUeE9rWVFVlN1p8xV9mijL09jSobhid-z-MBpcHU/edit?usp=sharing">HERE.</a>
                                </b>
                            </p>
                            <p className="flow-text">
                                Masters of the Rift has been developed as part of the 2016 API Challenge by Riot Games.
                                From reading the brief of the API challenge it was clear that we needed to look towards
                                creating something much bigger and better than our last entry.
                            </p>
                            <p className="flow-text">
                                Masters of the Rift (MOTR) is a true social experience that allows players to battle against each
                                other from anywhere in the world to see who knows the most about summoners rift. MOTR has been
                                created as a full Single-page application and supports full asynchronous communication between
                                clients and the server.
                            </p>
                            <h3 className="motr-pink">Social Elements</h3>
                            <p className="flow-text">
                                When looking at the announcement we saw that by giving players a social experience this would be a big plus so
                                we decided to try and make the experience as social as possible by including lots of features which
                                update on-the-fly and in realtime such as:
                            </p>
                            <ul className="flow-text motr-blue">
                                <li className="">Live Leaderboards that update as games are completed.</li>
                                <li className="">Live Queue data lets you see how many are queueing and who is playing at all times.</li>
                                <li className="">Live game progression allows you to see what questions your opponent has already answered.</li>
                            </ul>
                            <p className="flow-text">
                                We also wanted to include an in-game chat but unfortunately ran out of time, but this is planned for a later release.
                            </p>
                            <h3 className="motr-pink">Matches</h3>
                            <p className="flow-text">
                                A Match is played between two players. When a match is created, a random match is generated from
                                existing players in <span className="motr-blue">Challenger</span> league from EUW. We then grab
                                all the match information we need from various endpoints <b>(including mastery data)</b> and send
                                it back to both clients.
                            </p>
                            <p className="flow-text">
                                To achieve this we utilized technologies such as Socket.IO and ReactJS to achieve a fluid and reactive application.
                                By having clients emit and receive events we can ensure both players are synced together inside a game and there are
                                a little issues as possible.
                            </p>
                            <p className="flow-text motr-pink center-align">
                                <b>
                                    We encourage you to learn more in depth about how this project was created by visiting <a target="_blank" href="https://docs.google.com/document/d/1OQTJUeE9rWVFVlN1p8xV9mijL09jSobhid-z-MBpcHU/edit?usp=sharing">HERE.</a>
                                </b>
                            </p>
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