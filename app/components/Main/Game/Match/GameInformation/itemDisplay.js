/** @jsx React.DOM */


var ItemDisplay = React.createClass({

    getInitialState: function(){
        return({
            stats:this.props.stats
        })
    },

    componentWillReceiveProps: function(nextProps){
        this.setState({
            stats:nextProps.stats
        })
    },

    render: function(){
        var rows = [];
        for (var i=0; i < 7; i++) {
            if(this.state.stats.hasOwnProperty('item'+i)){
                var propString = 'item'+i;
                var imgString = 'http://ddragon.leagueoflegends.com/cdn/6.9.1/img/item/'+this.state.stats[propString]['image']['full'];
                if(i < 6) {
                    rows.push(
                        <div className="left center-align">
                            <div className="square no-select">
                                <img className="no-select" src={imgString}/>
                            </div>
                        </div>
                    );
                }else if(i == 6){
                    rows.push(
                        <div className="left center-align">
                            <div className="square no-select trinket">
                                <img className="no-select" src={imgString}/>
                            </div>
                        </div>
                    );
                }
            }
        }
        return(
            <div>
                {rows}
            </div>
        );
    }

})