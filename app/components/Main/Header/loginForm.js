/** @jsx React.DOM */

var LoginForm = React.createClass({

    componentDidMount: function(){
        $(document).ready(function() {
            $('select').material_select();
        });
    },

    render: function(){
        return(
            <div id="login-form" className="header-secondary col s6">
                <form>
                    <div className="input-field col s3">
                        <input placeholder="Summoner Name" id="summoner" type="text" className="validate" />
                            <label className="active" for="summoner">Summoner Name</label>
                    </div>
                    <div className="input-field col s2">
                        <select>
                            <option value="" disabled selected>Region</option>
                            <option value="na">NA</option>
                            <option value="euw">EUW</option>
                            <option value="eune">EUNE</option>
                            <option value="jp">JP</option>
                            <option value="kr">KR</option>
                            <option value="lan">LAN</option>
                            <option value="las">LAS</option>
                            <option value="br">BR</option>
                            <option value="oce">OCE</option>
                            <option value="pbe">PBE</option>
                            <option value="ru">RU</option>
                            <option value="tr">TR</option>
                        </select>
                        <label>Region</label>
                    </div>
                    <div className="input-field col s3">
                        <input placeholder="Password" id="password" type="password" className="validate" />
                        <label className="active" for="password">Password</label>
                    </div>
                    <a className="waves-effect waves-light btn-large blue-grey login-btn">Login</a>
                    <a className="waves-effect waves-light btn blue-grey darken-2 register-btn">Register</a>
                </form>
            </div>
        )
    }
})