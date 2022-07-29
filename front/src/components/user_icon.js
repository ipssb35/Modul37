import React,{ Component } from 'react';
import { connect } from 'react-redux';

class UserIcon extends Component {

    render(){
        console.log(this.props.chatUsers[ this.props.user_id ])
        return (
        <div className={"UserIcon OnlineState" + Number(this.props.chatUsers[ this.props.user_id ].IsOnline)}>
            <img src={this.props.chatUsers[ this.props.user_id ].avatar }/>
        </div>
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
)(UserIcon);