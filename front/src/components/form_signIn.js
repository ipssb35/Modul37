import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RequestSignIn, SignInChangeLogin, SignInChangePassword } from '../redux/actions';
import { Link } from "react-router-dom"

class SignIn extends Component{



    render(){
        return (
        <form className="formSignIn" onSubmit={(e) => {e.preventDefault(); this.props.RequestSignIn()}}>
            <div className="FormContent column">

                <div>
                    <span>Имя пользователя или E-MAIL</span>
                    <div className="inputContainer username"><input onChange={(e) => this.props.SignInChangeLogin(e.target.value)}  required type="text" name="username"></input></div> 
                </div>

                <div className="password_container">
                    <span>Пароль</span>
                    <div className="inputContainer password"><input onChange={(e) => this.props.SignInChangePassword(e.target.value)} required type="password" name="password"></input></div>
                </div>
                {this.props.errorCode === 20 && <span className="SignUpError" >{this.props.error}</span>} 
                <div>
                    <div className="inputContainer"><input type="submit" value="Войти"></input></div>
                </div>

            </div>

            <div className="links-auth row">
                <a href="http://localhost:3000/api/auth/yandex" className="yandex"/>
            </div>
        </form>
        );
    }
}

const mapStateToProps = state => {
    return { 
        errorCode:state.app.errorCode, 
        error:state.app.error, 
    };
};

export default connect(
    mapStateToProps,
    {SignInChangeLogin,SignInChangePassword,RequestSignIn}
)(SignIn)