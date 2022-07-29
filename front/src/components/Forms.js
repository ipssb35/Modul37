import React, { Component } from 'react';
import SignUp from './form_signup';
import Loader from './loader';
import SignIn from './form_signIn';
import UserSearchAddedChannel from './form_user_search';
import { connect } from 'react-redux';
import { ChangeFormState } from '../redux/actions';

class Forms extends Component {

    forms = {
        0 : <SignIn/>,
        1 : <SignUp/>,
        2 : <UserSearchAddedChannel/>,
    }

    componentDidMount(){
        document.title = 'Chat RUS | Авторизация' 
    }

    getModalWindow(){
        return this.forms[this.props.formIndex];
    }

    render(){
        return (
            <div className="ModalIconForms">
                <div className={this.props.Loading ? 'Loading' : undefined}>
                    <div  className="CloseForms" onClick={(e) => this.props.ChangeFormState(false)}>
                        <div className="bar1"/>
                        <div className="bar2"/>
                    </div>
                    { this.props.formIndex < 2 ? 
                    <div className="FormHeader row">
                        <h2 id="h2" className={this.props.formIndex === 1 ? 'OpenForm' : undefined} onClick={() => this.props.ChangeFormState(true,1)}>Создание Аккаунта</h2>
                        <h2 id="h3" className={this.props.formIndex === 0 ? 'OpenForm' : undefined} onClick={() => this.props.ChangeFormState(true,0)}>Авторизация</h2>  
                    </div> : undefined
                    }
                    {this.props.Loading && <Loader/>}
                    {
                        this.getModalWindow()
                    }
                </div>
            </div>
        )
    }
}
 
const mapStateToProps = state => {
    console.log(state.app)
    return { 
        formIndex: state.app.formIndex, 
        Loading:state.app.FormLoading, 
    };
};

export default connect(
    mapStateToProps,
    {ChangeFormState}

)(Forms)