import {INITIALIZE_APP, APP_CHANGE_FORM_LOADING_STATE, APP_CHANGE_LOADING_STATE, SIGNIN_CHANGE_LOGIN,SIGNIN_CHANGE_PASSWORD,SIGNUP_CHANGE_EMAIL, SIGNUP_CHANGE_PASSWORD, SIGNUP_CHANGE_PASSWORD_REPAET, SIGNUP_CHANGE_USERNAME,SIGNUP_CHANGE_GENDER,SIGNUP_CHANGE_DATE_BIRTH, APP_CHANGE_FORM_STATE, APP_CHANGE_ERROR, USER_CHANGE_USERNAME, USER_CHANGE_AVATAR, USER_CHANGE_IS_AUTH, CHATS_CHANGE_LIST, CHATS_CHANGE_USER_DATA, CHATS_CHANGE_CHAT_DATA, USER_CHANGE_ID, CHATS_CHANGE_SELECTED_CHAT, CHATS_ADD_MESSAGE_FOR_CHAT} from './types'
import cfg from '../config/api.json'
import Cookies from 'universal-cookie'
const cookies = new Cookies()

// CHATS

export function ChatChangeList(chats){
    return {
        type:CHATS_CHANGE_LIST,
        payload:chats,
    }
}

export function ChatAddUserData(id,data){
    return {
        type:CHATS_CHANGE_USER_DATA,
        payload:{
            id:id,
            data:data,
        },
    }
}

export function ChatsAddChatInfo(id,data){
    return {
        type:CHATS_CHANGE_CHAT_DATA,
        payload:{
            id:id,
            data:data,
        },
    }
}

export function ChatsChangeChatSelect(id){
    return {
        type:CHATS_CHANGE_SELECTED_CHAT,
        payload:id
    }
}

export function ChatsAddMessageForChat(chatID,message){
    return {
        type:CHATS_ADD_MESSAGE_FOR_CHAT,
        payload:{
            id:chatID,
            message:message,
        }
    }
}


// APP
export function InitAPP(){
    return {
        type:INITIALIZE_APP
    }
}

export function ChangeErrorAPP(errorCode,error){
    return {
        type:APP_CHANGE_ERROR,
        payload:{
            errorCode:errorCode,
            error:error,
        },
    }
}

export function ChangeFormState(IsOpenForms,formIndex = 0){
    return {
        type:APP_CHANGE_FORM_STATE,
        payload:{
            formIndex:formIndex,
            IsOpenForms:IsOpenForms,
        },
    }
}

export function ChangeFormLoadingState(state){
    return {
        type:APP_CHANGE_FORM_LOADING_STATE,
        payload:state,
    }
}


export function ChangeLoadingState(state){
    return {
        type:APP_CHANGE_LOADING_STATE,
        payload:state,
    }
}


// SIGN UP FORM
export function SignUpChangeUserName(value){
    return {
        type:SIGNUP_CHANGE_USERNAME,
        payload:value,
    }
}

export function SignUpChangePassword(value){
    return {
        type:SIGNUP_CHANGE_PASSWORD,
        payload:value,
    }
}

export function SignUpChangePasswordRepeat(value){
    return {
        type:SIGNUP_CHANGE_PASSWORD_REPAET,
        payload:value,
    }
}

export function SignUpChangeGender(value){
    return {
        type:SIGNUP_CHANGE_GENDER,
        payload:value,
    }
}

export function SignUpChangeDateBirth(value){
    return {
        type:SIGNUP_CHANGE_DATE_BIRTH,
        payload:value,
    }
}


export function SignUpChangeEmail(value){
    return {
        type:SIGNUP_CHANGE_EMAIL,
        payload:value,
    }
}

// SIGN IN FORM

export function SignInChangeLogin(value){
    return {
        type:SIGNIN_CHANGE_LOGIN,
        payload:value,
    }
}

export function SignInChangePassword(value){
    return {
        type:SIGNIN_CHANGE_PASSWORD,
        payload:value,
    }
}

// USER DATA

export function UserDataChangeUserName(value){
    return {
        type:USER_CHANGE_USERNAME,
        payload:value,
    }
}

export function UserDataChangeAvatarURL(value){
    return {
        type:USER_CHANGE_AVATAR,
        payload:value,
    }
}

export function UserDataChangeID(value){
    return {
        type:USER_CHANGE_ID,
        payload:value,
    }
}

export function UserDataChangeIsAuth(value){
    return {
        type:USER_CHANGE_IS_AUTH,
        payload:value,
    }
}


// REQUESTS

export function RequestSignUp(){
    return async (dispatch, getState) => {
        const { signUpForm } = getState()
        dispatch(ChangeFormLoadingState(true))
        dispatch(ChangeErrorAPP(0,''))
        const response = await (await fetch(cfg.api_auth + 'signup',{
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
            },
            body: JSON.stringify(signUpForm),
        })).json()
        dispatch(ChangeErrorAPP(response.errorCode,response.error[0]))
        dispatch(ChangeFormLoadingState(false))
        if (response.statusCode == 0)
            window.location.reload()
    }
}
export function RequestSearchUser(keyWord){
    return async (dispatch, getState) => {
        const { signUpForm } = getState()
        dispatch(ChangeFormLoadingState(true))
        dispatch(ChangeErrorAPP(0,''))
        const response = await (await fetch(cfg.api_url + 'searchUsers',{
            method: 'POST',
            credentials:'include',
            headers: {
                'Content-Type':'application/json',
            },
            body: JSON.stringify({
                keyWord : keyWord,
            }),
        })).json()
        dispatch(ChangeErrorAPP(response.errorCode,response.error[0]))
        dispatch(ChangeFormLoadingState(false))
    }
}

export function RequestChatInfo(id){

    ChatsAddChatInfo(id,{
        users:[],
        messages:[],
    })
    
    return async (dispatch, getState) => {


        const res = await (await fetch(cfg.api_url + 'getChatInfo',{
            method: 'POST',
            credentials:'include',
            headers: {
                'Content-Type':'application/json',
            },
            body: JSON.stringify({
                id:id,
            }),
        })).json()
        dispatch(ChatAddUserData(res.data.author.id,{
            avatar:res.data.author.avatar_url,
            username:res.data.author.username,
        }))

        dispatch(ChatAddUserData(res.data.companion.id,{
            avatar:res.data.companion.avatar_url,
            username:res.data.companion.username,
        }))

        dispatch(ChatsAddChatInfo(id,{
            users:[res.data.author.id,res.data.companion.id],
            messages:res.data.chatMessages,
        }))
    }
}

export function RequestSignIn(){
    return async (dispatch, getState) => {
        const { signInForm } = getState()
        dispatch(ChangeFormLoadingState(true))
        dispatch(ChangeErrorAPP(0,''))
        const response = await (await fetch(cfg.api_auth + 'signin',{
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
            },
            body: JSON.stringify(signInForm),
        })).json()
        dispatch(ChangeErrorAPP(response.errorCode,response.error[0]))
        dispatch(ChangeFormLoadingState(false))

        if (response.statusCode === 0){
            cookies.set('auth',response.data['token']);
            window.location.reload();
        }
    }
}

