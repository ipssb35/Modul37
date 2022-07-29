export const signUpDefault = {
    username:'',
    password:'',
    password_repeat:'',
    dateBirth:'',
    gender:'',
    email:'',
}

export const signInDefault = { 
    username:'',
    password:'',
}

export const InitializeAPPDefault = {
    IsOpenForms:false,
    formIndex:1, // 0 - sign up 1 - sign in
    IsLoading:true,
    FormLoading:false,
    socket:null,
    errorCode:0, // unique code for error 
    error:'', // description for error
}


export const UserDataDefault = {
    username:'',
    avatarURL:'',
    id:-1,
    is_auth:false,
}

export const ChatsData = {
    chatList:[],
    chatsData:{},
    chatUsers:{}, // [id]:<Object>info
    chatSelect:-1,
}
