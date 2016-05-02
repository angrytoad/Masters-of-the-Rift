/** @jsx React.DOM */

var Match = React.createClass({

    getInitialState: function(){
        return({
            loggedIn:this.props.loggedIn,
            summoner:this.props.summoner,
            loginId:this.props.loginId,
            matchId:this.props.matchId,
            gameData:{},
            gameDataReceived:false
        })
    },

    componentWillReceiveProps: function(nextProps){
        this.setState({
            loggedIn:nextProps.loggedIn,
            summoner:nextProps.summoner,
            loginId:nextProps.loginId,
            matchId:nextProps.matchId
        });
    },

    componentDidMount: function(){
        venti.on('callMatchEnd',this.callMatchEnd);

        socket.on('requiredGameDataEvent',this.requiredGameDataEvent)
    },

    componentWillUnmount: function(){
        venti.off('callMatchEnd',this.callMatchEnd);
    },

    callMatchEnd: function(){
        socket.emit('callMatchEnd');
    },

    requiredGameDataEvent: function(data){
        /*
            - Object (Object
              - Teams (Object)
                - Red (Arrays of Players)
                    - Player (Object)
                - Blue (Arrays of Players)
                    - Player (Object)


        */
        console.log(data);
        this.setState({
            gameDataReceived:true,
            gameData:data
        });
    },

    render: function(){
        if(this.state.gameDataReceived) {
            return (
                <div>
                    <div className="timer-wrap">
                        <MatchTimer />
                    </div>
                    <GameInformation data={this.state.gameData}/>
                    <OpponentInformation />
                </div>
            )
        }else{
            return (
                <div>
                    <p className="flow-text">
                        Waiting on server...
                    </p>
                </div>
            )
        }
    }

})