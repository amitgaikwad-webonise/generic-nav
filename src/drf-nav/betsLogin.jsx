import fetch from 'isomorphic-fetch';
import session from "./session-storage";
import React from "react"; 
import ApiEndpoints from './api-endpoints';

export default class BetsLogin extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      showError: false
    }
  }

  onLoginClick(){
    const url = ApiEndpoints.BETS_LOGIN;
    let token;
    const data = {
      "userName": this.refs.userNameRef.value,
      "userPassword": this.refs.passRef.value,
      "auditTrailID": "db",
      "userState": ""};
    var params = {
      method: 'POST',
      dataType: 'JSON',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
    fetch(url, params)
      .then(response =>  {
        token = response.headers.get('x-auth-token')
        return response.json();
      })
      .then((data) => {
        this.loginSuccess(data,token);
      })
      .catch(err => {
        this.setState({showError: true})
      })
  }

  loginSuccess(data,token){
    session.setDrfCookie(data, token);
    this.setState({showError: false}, ()=>{
      this.props.onLoginSuccess();
      window.location.reload();  
    })
  }

  render(){
    return (
      <div className="drfNavLoginWrap pull-left">
          <h4>Sign In to your DRF Bets Account</h4>
          <form>
            <div className="loginInputWrap form-group">
              <input type="text" className=" form-control" ref="userNameRef" placeholder="Username"/>
              <span className="drfNavErrMsg hide">Error Message</span>
            </div>
            <div className="loginInputWrap form-group">
              <input type="password" className=" form-control" ref="passRef" placeholder="Password"/>
              <span className="drfNavErrMsg hide">Error Message</span>
            </div>
            {this.state.showError ? <span className="drfNavErrMsg"> Invalid Username or Password</span> : '' }
            <a href={ApiEndpoints.UPDATE_PASSWORD} className="drfNavForgotPassLink">Forgot Password</a>
            <a onClick={this.onLoginClick.bind(this)} className="btn drfNavHeaderBtn">Login</a>
            <p href={ApiEndpoints.REGISTER} className="drfNavRegLink">
              Don't have an account?
              <a href={ApiEndpoints.REGISTER}>Register Here</a>
            </p>
          </form>
      </div>
    );
  }
}