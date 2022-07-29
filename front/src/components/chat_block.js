import React,{ Component } from 'react';
import { connect } from 'react-redux';
import { ChatAddUserData, ChatsAddChatInfo, ChatsChangeChatSelect, RequestChatInfo } from '../redux/actions';
import Loader from './loader';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import UserName from './user_name';
import UserIcon from './user_icon';


class ChatSelector extends Component{

    componentDidMount(){

        if (this.props.chatsData[this.props.id]) return
        this.props.RequestChatInfo(this.props.id)
    }

    SelectChat(){
        this.props.ChatsChangeChatSelect(this.props.id)
        this.props.history.push('/profile/channel/' + this.props.id);
    }


    render(){
        if (!this.props.chatsData[this.props.id])
            return <div className="ChatContainer row" style={{position:'relative'}} > <Loader/> </div>
        const messages = this.props.chatsData[this.props.id].messages
        const userIndex = Number(this.props.chatsData[this.props.id].users[0] == this.props.user_id)
        return (
            <div onClick={() => this.SelectChat()} className={ "ChatContainer row " + (this.props.chatSelect == this.props.id ? 'select' : '' ) }>
                <UserIcon user_id={this.props.chatsData[this.props.id].users[userIndex]} />
                <div className="column rightUserBlock">
                    <div className="row UserHeader">
                        <UserName user_id={this.props.chatsData[this.props.id].users[userIndex]} />
                        <span>
                            00:00
                        </span>
                    </div>
                    <div className="User_last_message">
                        <div>
                            {messages[messages.length - 1] && messages[messages.length - 1].content || '— Напишем?'}
                        </div>
                    </div>    
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return { 
        chatsData:state.chats.chatsData, 
        chatUsers:state.chats.chatUsers, 
        user_id:state.user.id,
        chatSelect:state.chats.chatSelect
    };
};

export default compose(
    withRouter,
    connect(
        mapStateToProps,
        { ChatAddUserData,ChatsAddChatInfo,RequestChatInfo,ChatsChangeChatSelect }
    )
)(ChatSelector)
