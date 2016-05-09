/** @jsx React.DOM */


/**
 * class    @LoginForm
 *
 * states
 *  - error: any error message that should be displayed
 *  - is_error: boolean to determine whether messages back from the server are errors or not.
 *
 *  desc    This component handles all logging in and registering of new users, one of the cool side-effects of
 *          deciding to build a login/registration component the REACT way means that when you successfully
 *          register the form can keep all of your details in it and you can login right away.
 */
var LoginForm = React.createClass({

    componentDidMount: function(){
        $(document).ready(function() {
            $('select').material_select();
            $('#login-form-main').jrumble();
        });

        /**
         * Listen for various authentication events that we might encounter whilst trying to either login or register
         * All of these events will display different messages and call the appropriate method in this class.
         */
        socket.on('loginErrorEvent',this.loginErrorEvent);
        socket.on('noUserFoundEvent',this.noUserFoundEvent);
        socket.on('loginFailedEvent',this.loginFailedEvent);
        socket.on('loginSuccessEvent', this.loginSuccessfulEvent);

        socket.on('registrationFailedEvent', this.registrationFailedEvent);
        socket.on('registrationSuccessEvent', this.registrationSuccessEvent);

        venti.on('authErrorEvent',this.authErrorEvent);
    },

    componentWillUnmount: function(){
        /**
         * Stop listening for all of the events we described in componentDidMount
         */
        socket.removeListener('loginErrorEvent');
        socket.removeListener('noUserFoundEvent');
        socket.removeListener('loginFailedEvent');
        socket.removeListener('loginSuccessEvent');

        socket.removeListener('registrationFailedEvent');
        socket.removeListener('registrationSuccessEvent');

        venti.off('authErrorEvent',this.authErrorEvent);
    },

    authErrorEvent: function(){
        this.setState({error:'Please log in again',is_error:true});
        this.rumbleForm();
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
        setSession(data.loginId,data.token);
        venti.trigger('changeLoggedState',{loggedIn:true,summoner:data.summonerName,loginId:data.loginId});
    },

    loginRequest: function(){
        /**
         * Make a login request to the server via the loginRequest socket event, ensure all fields are filled out.
         */
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
        /**
         * Rumble the form if an error occurs
         */
        $('#login-form-main').trigger('startRumble');
        var rumbleTimeout = setTimeout(function(){$('#login-form-main').trigger('stopRumble');}, 200)
    },

    render: function(){
        /**
         * Render the login form, reasonably straight forward as there isnt much state checking here as if the user
         * managed to authenticate successfully then the parent component will unmount this one in exchange for
         * the UserDisplay component.
         */
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