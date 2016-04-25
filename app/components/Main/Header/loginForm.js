/** @jsx React.DOM */

var LoginForm = React.createClass({

    componentDidMount: function(){
        $(document).ready(function() {
            $('select').material_select();
            $('#login-form-main').jrumble();
        });


        socket.on('loginErrorEvent',this.loginErrorEvent);
        socket.on('noUserFoundEvent',this.noUserFoundEvent);
        socket.on('loginFailedEvent',this.loginFailedEvent);
        socket.on('loginSuccessEvent', this.loginSuccessfulEvent);

        socket.on('registrationFailedEvent', this.registrationFailedEvent);
        socket.on('registrationSuccessEvent', this.registrationSuccessEvent);
    },

    componentWillUnmount: function(){
        socket.removeListener('loginErrorEvent');
        socket.removeListener('noUserFoundEvent');
        socket.removeListener('loginFailedEvent');
        socket.removeListener('loginSuccessEvent');

        socket.removeListener('registrationFailedEvent');
        socket.removeListener('registrationSuccessEvent');
    },

    getInitialState: function(){
        return({
            error:'',
            is_error:true
        })
    },

    loginErrorEvent: function(data){
        this.setState({error:data.error,is_error:true});
        this.rumbleForm();
    },

    noUserFoundEvent: function(data){
        this.setState({error:'Bad username/password combination.',is_error:true});
        this.rumbleForm();
    },

    loginFailedEvent: function(data){
        this.setState({error:data.error,is_error:true});
        this.rumbleForm();
    },
    
    loginSuccessfulEvent: function(data){
        venti.trigger('changeLoggedState',{loggedIn:true,summoner:data.summonerName,loginId:data.loginId});
    },

    loginRequest: function(){
        this.setState({error:'',is_error:true});
        var data = $('#login-form-main').serializeArray();
        var validated = false;
        var counter = 0;

        var requestObject = {};

        for(var key in data){
            if(!data.hasOwnProperty(key)) continue;

            var input = data[key];
            if(input["value"].length > 0){
                counter++;
                requestObject[input["name"]] = input["value"];
            }else{
                $('#login-form-main input[name="'+input["name"]+'"]').removeClass('valid').addClass('invalid');
            }
        }

        if(counter == 3){
            console.log('making login request');
            socket.emit('loginRequest',{login:requestObject});
        }else{
            this.setState({error:'Please fill out the required fields.'});
            this.rumbleForm();
        }

    },

    registrationFailedEvent: function(data){
        this.setState({error:data.error,is_error:true});
        this.rumbleForm();
    },

    registrationSuccessEvent: function(data){
        console.log('REGISTERED SUCCESSFULLY');
        this.setState({error:'You have successfully registred, you may now log in',is_error:false})
    },

    registerRequest: function(){
        this.setState({error:'',is_error:true});
        var data = $('#login-form-main').serializeArray();
        var validated = false;
        var counter = 0;

        var requestObject = {};

        for(var key in data){
            if(!data.hasOwnProperty(key)) continue;

            var input = data[key];
            if(input["value"].length > 0){
                counter++;
                requestObject[input["name"]] = input["value"];
            }else{
                $('#login-form-main input[name="'+input["name"]+'"]').removeClass('valid').addClass('invalid');
            }
        }

        if(counter == 3){
            socket.emit('registerRequest',{login:requestObject});
        }else{
            this.setState({error:'Please fill out the required fields.'});
            this.rumbleForm();
        }

    },

    rumbleForm: function(){
        $('#login-form-main').trigger('startRumble');
        var rumbleTimeout = setTimeout(function(){$('#login-form-main').trigger('stopRumble');}, 200)
    },

    render: function(){
        return(
            <div id="login-form" className="header-secondary col s6">
                <form id="login-form-main">
                    <div className="input-field col s3">
                        <input placeholder="Summoner Name" name="summoner" id="summoner" type="text" className="validate" />
                            <label className="active" for="summoner">Summoner Name</label>
                    </div>
                    <div className="input-field col s2">
                        <select name="region">
                            <option value="" disabled selected>Region</option>
                            <option value="NA">NA</option>
                            <option value="EUW">EUW</option>
                            <option value="EUNE">EUNE</option>
                            <option value="JP">JP</option>
                            <option value="KR">KR</option>
                            <option value="LAN">LAN</option>
                            <option value="LAS">LAS</option>
                            <option value="BR">BR</option>
                            <option value="OCE">OCE</option>
                            <option value="PBE">PBE</option>
                            <option value="RU">RU</option>
                            <option value="TR">TR</option>
                        </select>
                        <label>Region</label>
                    </div>
                    <div className="input-field col s3">
                        <input placeholder="Password" name="password" id="password" type="password" className="validate" />
                        <label className="active" for="password">Password</label>
                    </div>
                    <div className="col s12">
                        {(
                            this.state.is_error
                                ? <span className="red-text left-align">{this.state.error}</span>
                                : <span className="green-text left-align">{this.state.error}</span>
                        )}
                    </div>
                    <a className="waves-effect waves-light btn-large blue-grey login-btn" onClick={this.loginRequest}>Login</a>
                    <a className="waves-effect waves-light btn blue-grey darken-2 register-btn" onClick={this.registerRequest}>Register</a>
                </form>

            </div>
        )
    }
})