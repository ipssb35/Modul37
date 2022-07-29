import React, { Component } from 'react';
import cfg from '../config/api.json'
import { connect } from 'react-redux';
import { RequestSearchUser, ChangeErrorAPP, ChangeFormLoadingState, ChatChangeList } from '../redux/actions';

class UserSearchAddedChannel extends Component{

    

    OnChangeInput(value){
        this.setState({
            text : value,
        })
    }

    async OnRequestForm(){

        this.props.ChangeFormLoadingState(true)
        this.props.ChangeErrorAPP(0,'')

        const response = await (await fetch(cfg.api_url + 'searchUsers',{
            method: 'POST',
            credentials:'include',
            headers: {
                'Content-Type':'application/json',
            },
            body: JSON.stringify({
                keyWord : this.state.text,
            }),
        })).json()

        this.setState({
            users : response.data,
        })

        this.props.ChangeFormLoadingState(false)
        this.props.ChangeErrorAPP(response.errorCode,response.error[0])

    }

    constructor(props){
        super(props)
        this.state = {
            text : '',
            users : [],
        }
    }

    async OnSelectAddedChannel(user_id){
        const data = await (await fetch(cfg.api_url + 'addChannel',{
            method: 'POST',
            credentials:'include',
            headers: {
                'Content-Type':'application/json',
            },
            body: JSON.stringify({
                userID : user_id,
            }),
        })).json()

        if (data.statusCode == 0 ){
            this.props.ChatChangeList(data.data)
        }


    }

    UserRow(avatar,username,key){
        return (
        <div onClick={e => this.OnSelectAddedChannel(key)} key={key} className="UserRowSearch">
            <img src={avatar} />
            <span >{username}</span>
        </div>);
    }

    render(){
        return (
        <form className="FormUserSearch" onSubmit={(e) => {e.preventDefault(); this.OnRequestForm(); }}>
            <div className="FormContent column">
                <div>
                    <span>Имя пользователя или Email</span>
                    <div className="inputContainer none"><input onChange={(e) => this.OnChangeInput(e.target.value)} required type="text" name="SearchName"></input></div>
                    {this.props.errorCode === 30 && <span className="SignUpError" >{this.props.error}</span>}
                </div>
            </div>
            <div className="UsersContainer" >
            {Array.prototype.map.call(this.state.users, value => {
                    return this.UserRow(value.avatar_url,value.username,value.id);
            }, this)}
            </div>
            <div className="inputContainer SearchUsers"><input type="submit" value="Найти"></input></div>
        </form>
        );
    }
}

const mapStateToProps = state => {
    return { 
        error:state.app.error, 
        errorCode:state.app.errorCode,
    };
  };

export default connect(
    mapStateToProps,
    {RequestSearchUser,ChangeFormLoadingState,ChangeErrorAPP,ChatChangeList},
)(UserSearchAddedChannel)