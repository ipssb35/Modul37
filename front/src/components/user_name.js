import React,{ Component } from 'react';
import { connect } from 'react-redux';

class UserName extends Component {

    render(){

        return (
        <span className="UserName_list">
            { this.props.chatUsers[this.props.user_id].username }
        </span>
        )

    }

}

const mapStateToProps = state => {
    return { 
        chatUsers:state.chats.chatUsers, 
    };
};

export default connect(
    mapStateToProps,
    { }
)(UserName);