/** @jsx React.DOM */

var LoginForm = React.createClass({

    componentDidMount: function(){
        $(document).ready(function() {
            $('select').material_select();
            $('#login-form-main').jrumble();
        });
    },

    loginRequest: function(){
        var data = $('#login-form-main').serializeArray();
        var validated = false;
        var counter = 0;

        var requestObject = {};

        for(var key in data){
            if(!data.hasOwnProperty(key)) continue;

            var input = data[key];
            console.log(input);
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

            $('#login-form-main').trigger('startRumble');
            var rumbleTimeout = setTimeout(function(){$('#login-form-main').trigger('stopRumble');}, 200)
        }

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
                    <a className="waves-effect waves-light btn-large blue-grey login-btn" onClick={this.loginRequest}>Login</a>
                    <a className="waves-effect waves-light btn blue-grey darken-2 register-btn">Register</a>
                </form>
            </div>
        )
    }
})