import React, { Component, StrictMode } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import '../component_styles/ChatList.css'
import ChatSelector from './chat_block';
import ChatContainer from './chat_container';
// import MessageBlock from './MessageBlock';
import cfg from '../config/api.json'
import { ChangeFormState } from '../redux/actions';

class Profile extends Component{
    
    addChannel(){
            
      this.props.ChangeFormState(true,2);

    }
    
    render(){

        return (
        <div className="row Profile">
            <nav className="NavChatList">

                <div className="Header">
                    <span>Список Чатов</span>
                </div>

                <div className="SearchContent">
                    <input placeholder="Search"/>
                </div>

                <div className="ChatListContainer column">

                {Array.prototype.map.call(this.props.chatList, value => {
                    return <ChatSelector key={value.id} id={value.id} />;
                }, this)}

                    <div onClick={() => this.addChannel()} className="addChannel"/>
                </div>

            </nav>

            <ChatContainer/>


        </div>
        )
    }
}

const mapStateToProps = state => {
    return { 
        chatList:state.chats.chatList, 
    };
};

export default compose(
    withRouter,
    connect(
        mapStateToProps,
        {ChangeFormState},
    )
)(Profile)
