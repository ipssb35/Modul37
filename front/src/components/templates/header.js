import React, { Component, StrictMode } from 'react';
import { connect } from 'react-redux';
import { ChangeFormState } from '../../redux/actions';
import { Link,useHistory } from "react-router-dom"
import Cookies from 'universal-cookie'


class Header extends Component {

    Logout(){
        const cookie = new Cookies()
        cookie.remove('auth');
        window.location = '/'
    }

    ComponentHeader(){
        if (this.props.is_auth) {
            return (    
            <li>
                <Link onClick={ this.Logout } className="UserProfile row">
                    <div className="user_avatar">
                        <img src={this.props.avatarURL} alt=""/>
                    </div>
                    <div className="row UserName">
                        <span>{this.props.username}</span>
                    </div>
                    <div className="user_settings row"> 
                        <img src="/img/settings.png" />
                    </div>
                </Link>
            </li>
        )}

        return (
            <StrictMode>
                <li className="row hover_separator">
                    <div className='SectionNavigation-Item' onClick={(e) => this.props.ChangeFormState(true,1)}>
                        <span className='row Section-Title register'>Зарегистрироваться</span>
                    </div>       
                </li>
                <li>
                    <div className='SectionNavigation-Item' onClick={(e) => this.props.ChangeFormState(true,0)}>
                        <span className='Section-Title login'>Войти</span>
                    </div>       
                </li>
            </StrictMode>
        )
    }

    render(){
        return (
            <header className="App-header">
                <Link to="/" ><img alt="" src="/img/logo.png" className="logo"/></Link>

                <ul className="ul_links row">

                    {this.ComponentHeader()}

                </ul>


            </header>
        );
    }
};

const mapStateToProps = state => {
    return { 
        username:state.user.username, 
        avatarURL:state.user.avatarURL, 
        is_auth:state.user.is_auth,
    };
};

export default connect(
    mapStateToProps,
    {ChangeFormState},
)(Header)