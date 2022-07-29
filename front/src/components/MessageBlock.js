import React, { Component } from 'react';
import { connect } from 'react-redux';
import UserIcon from './user_icon';

class MessageBlock extends Component{
    render(){
        return (
        <div className={"MessageBlock row " + (this.props.isAuthor ? "IsAuthor" : '')} >
            <UserIcon user_id={this.props.author_id} />
            <div className="MessageContainer">
                <div className="MessageHeader row">
                    <span className="AuthorName">{this.props.chatUsers[this.props.author_id].username}</span>
                    <span className="dateMessage">24:32</span>
                </div>
                <span className="MessageContent column">
                    {this.props.text}
                </span>
            </div>
        </div>
        )
    }
}

const mapStateToProps = state => {
    return { 
        chatUsers:state.chats.chatUsers, 
        user_id:state.user.id,
    };
};

export default connect(
    mapStateToProps,
    {},
)(MessageBlock)