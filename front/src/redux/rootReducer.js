import {combineReducers } from 'redux';
import { signInDefault, signUpDefault,InitializeAPPDefault, UserDataDefault, ChatsData } from './default';
import { APP_CHANGE_FORM_STATE, APP_CHANGE_FORM_LOADING_STATE, APP_CHANGE_LOADING_STATE, SIGNIN_CHANGE_LOGIN, SIGNIN_CHANGE_PASSWORD, SIGNUP_CHANGE_DATE_BIRTH, SIGNUP_CHANGE_EMAIL, SIGNUP_CHANGE_GENDER, SIGNUP_CHANGE_PASSWORD, SIGNUP_CHANGE_PASSWORD_REPAET, SIGNUP_CHANGE_USERNAME, APP_CHANGE_ERROR, USER_CHANGE_USERNAME, USER_CHANGE_AVATAR, USER_CHANGE_IS_AUTH, INITIALIZE_APP, CHATS_CHANGE_LIST, CHATS_CHANGE_USER_DATA, CHATS_CHANGE_CHAT_DATA, USER_CHANGE_ID, CHATS_CHANGE_SELECTED_CHAT, CHATS_ADD_MESSAGE_FOR_CHAT } from './types';


function APPReducer(state = InitializeAPPDefault,actions){
    switch (actions.type) {
        case APP_CHANGE_FORM_STATE:
            return {...state,formIndex:actions.payload.formIndex,IsOpenForms:actions.payload.IsOpenForms}   
        case APP_CHANGE_LOADING_STATE:
            return {...state,IsLoading:actions.payload} 
        case APP_CHANGE_FORM_LOADING_STATE:
            return {...state,FormLoading:actions.payload} 
        case APP_CHANGE_ERROR:
            return {...state,errorCode:actions.payload.errorCode,error:actions.payload.error}
        case INITIALIZE_APP:
            return {...state,socket:require('socket.io-client').connect('http://localhost:3000/')}
        default:
            return state;
    }
}

function SignInReducer(state = signInDefault,actions){
    switch (actions.type) {
        case SIGNIN_CHANGE_PASSWORD:
            return {...state,password:actions.payload}    
        case SIGNIN_CHANGE_LOGIN:
            return {...state,username:actions.payload} 
        default:
            return state;
    }
}

function signUpReducer(state = signUpDefault,actions){

    switch (actions.type) {
        case SIGNUP_CHANGE_USERNAME:
            return  {...state,username:actions.payload}
        case SIGNUP_CHANGE_PASSWORD:
            return  {...state,password:actions.payload}
        case SIGNUP_CHANGE_PASSWORD_REPAET:
            return  {...state,password_repeat:actions.payload}
        case SIGNUP_CHANGE_EMAIL:
            return  {...state,email:actions.payload}
        case SIGNUP_CHANGE_GENDER:
            return {...state,gender:actions.payload}
        case SIGNUP_CHANGE_DATE_BIRTH:
            return {...state,dateBirth:actions.payload}
        default:
            return state
    }
}

function UserReducer(state = UserDataDefault,actions){
    switch (actions.type) {
        case USER_CHANGE_USERNAME:
            return {...state,username:actions.payload}
        case USER_CHANGE_AVATAR:
            return {...state,avatarURL:actions.payload}
        case USER_CHANGE_IS_AUTH:
            return {...state,is_auth:actions.payload}
        case USER_CHANGE_ID:
            return {...state,id:actions.payload}
        default:
            return state;
    }
}

function ChatsReducer(state = ChatsData,actions){
    switch (actions.type) {
        case CHATS_CHANGE_LIST:
            return {...state,chatList:actions.payload}
        case CHATS_CHANGE_USER_DATA:
            return {...state,chatUsers:{...state.chatUsers,[actions.payload.id]:actions.payload.data}}
        case CHATS_CHANGE_CHAT_DATA:
            return {...state,chatsData:{...state.chatsData,[actions.payload.id]:actions.payload.data}}
        case CHATS_CHANGE_SELECTED_CHAT:
            return {...state,chatSelect:actions.payload}
        case CHATS_ADD_MESSAGE_FOR_CHAT:
            console.log(state.chatsData[actions.payload.id])
            state.chatsData[actions.payload.id].messages.push(actions.payload.message)
            return {...state,chatsData:{...state.chatsData,[actions.payload.id]:state.chatsData[actions.payload.id]}}
                        
        default:
            return state;
    }
}

export const rootReducer = combineReducers({
    signInForm:SignInReducer,
    signUpForm:signUpReducer,
    app:APPReducer,
    user:UserReducer,
    chats:ChatsReducer,
})