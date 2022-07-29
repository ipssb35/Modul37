const express = require('express')
const router = express.Router();
var jwt = require('jsonwebtoken');
const SECRET_KEY = require('../config/secret.json').secret_auth_key;
const ExampleJsonResponse = require('../config/data_format.json');
const sha256 = require('js-sha256');
const db = require('../util/database');
const validator = require('validator');
const { route } = require('../app');
const fetch = require('node-fetch');
const Cookies = require('universal-cookie')
var socket = require('socket.io');
 
router.post('/auth/signin',async function(req, res){
  const data = { ...ExampleJsonResponse };
  const {username, password} = req.body;
  if (!username || !password) {
    data.statusCode = 1;
    data.errorCode = 20
    data.error = ['Ошибка авторизации'];
    res.send(data)
    return;
  }

  const userFind = (await db.query(`SELECT id,email,password,login
	FROM main."user"
	where (email = $1 or login = $2) and password = $3`,[
        username,
        username,
        sha256(password),
  ])).rows;
  if (userFind.length < 1) {
    data.statusCode = 1;
    data.errorCode = 20
    data.error = ['Пользователь не существует'];
    res.send(data)
    return;
  }

  data.data = {
    token:jwt.sign({id:userFind[0].id}, SECRET_KEY)
  } 

  res.send(data)
  
  

});
router.post('/auth/signup',async function(req, res){
  const send = res
  const data = { ...ExampleJsonResponse }
  const {username, password, password_repeat,dateBirth,gender,email} = req.body;
  if (password !== password_repeat) {
    data.statusCode = 1;
    data.errorCode = 1
    data.error = ['Пароли не совпадают!'];
    res.send(data)
    return;
  }

  if (!validator.isEmail(email)) {
    data.statusCode = 1;
    data.errorCode = 2
    data.error = ['Некорректный E-MAIL!'];
    res.send(data)
    return;   
  } 

  if (!validator.isLength(password,{min:6})) {
    data.statusCode = 1;
    data.errorCode = 3
    data.error = ['Пароль должен быть длиной от 6 символов.'];
    res.send(data)
    return;   
  }

  if (!validator.isLength(username,{
    max:31,
    min:4,
  })){
    data.statusCode = 1;
    data.errorCode = 4
    data.error = ['Имя пользователя должно быть длиной от 4 до 31 символов'];
    res.send(data)
    return;   
  }

  if (validator.matches(username,new RegExp('^[а-яА-Я0-9_.-]*$'))){
    data.statusCode = 1;
    data.errorCode = 4
    data.error = ['Некорректное имя пользователя. '];
    res.send(data)
    return;   
  }

  if (!(gender == 0 || gender == 1)){
    data.statusCode = 1;
    data.errorCode = 5
    data.error = ['Введён некорректный пол.'];
    res.send(data)
    return;  
  }

  if (!validator.isDate(dateBirth)){
    data.statusCode = 1;
    data.errorCode = 6
    data.error = ['Некорректная дата рождения!'];
    res.send(data)
    return; 
  }

  let response = await db.query(`SELECT login, email 
	FROM main."user"
	where email = $1 or login = $2`,[
        email,
        username,
  ]);

  const email_count = response.rows.filter(row => row.email.toLowerCase() == email.toLowerCase()).length;
  const username_count = response.rows.filter(row => row.login.toLowerCase() == username.toLowerCase()).length;
 
  if (email_count >  0){
    data.statusCode = 1;
    data.errorCode = 2
    data.error = ['Данный почтовый адрес уже используется!'];
    res.send(data)
    return; 
  }

  if (username_count >  0){
    data.statusCode = 1;
    data.errorCode = 4
    data.error = ['Данное имя пользователя уже используется!'];
    res.send(data)
    return; 
  }
  
  await db.query(`INSERT INTO main."user"(
    username, password, email, login,gender,dateBirth)
    VALUES ($1, $2, $3, $4, $5, $6)`,[
        username,
        sha256(password),
        email,
        username,
        gender,
        dateBirth,
  ]);
  res.send(data)

});
 
router.get('/auth/redirect_yandex',async (req,res) => {

  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('code', req.query.code);
  params.append('client_id', '189f73ed01794a3bb5b956312553b594');
  params.append('client_secret', '201d29fad6984145a77d408638920988');

  const data = await (await fetch('https://oauth.yandex.ru/token', {
    method: 'post',
    body:params,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })).json()

  if (!data.access_token){
    return res.redirect('/api/auth/yandex') // TOOLS MODE ONLY
  }
 
  const personalInfo = await (await fetch(`https://login.yandex.ru/info?format=json`,{
    headers:{
      Authorization: `OAuth ${data.access_token}`
    }
  })).json()

  let user = (await db.query(`SELECT id, username,avatar_url 
	FROM main."user"
	where username = $1`,[
    personalInfo.client_id,
  ])).rows

  if (user.length < 1){
    let data = (await db.query(`INSERT INTO main."user"(
      username, password, email, avatar_url, login,gender,dateBirth)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,[
          personalInfo.display_name,
          sha256(personalInfo.client_id),
          personalInfo.default_email,
          'http://avatars.mds.yandex.net/get-yapic/' + personalInfo.default_avatar_id + '/islands-middle',
          personalInfo.client_id,
          personalInfo.sex === 'male' ? 0 : 1,
          personalInfo.birthday || new Date(),
    ])).rows[0]

    console.log(personalInfo)

    res.cookie('auth',jwt.sign({id:data.id}, SECRET_KEY))
  }else{
    res.cookie('auth',jwt.sign({id:user[0].id}, SECRET_KEY))
  }
  
  res.redirect('http://localhost:3006')



})

router.get('/auth/yandex',(req,res) => {
  return res.redirect(`https://oauth.yandex.ru/authorize?response_type=code&client_id=189f73ed01794a3bb5b956312553b594&redirect_uri=http://localhost:3000/api/auth/redirect_yandex`)
})

router.use('/v1',(req, res, next) => {
  let isAuth = !!req.cookies.auth;
  if (req.cookies.auth){
    jwt.verify(req.cookies.auth,SECRET_KEY,(err) => {
        isAuth = err === null;
    })
  }

  if (isAuth)
    next();
  else {
    res.sendStatus(401)
  }
});

router.post('/v1/searchUsers',async (req,res) => {
  let userID = -1
  const searchUser = req.body.keyWord
  console.log(searchUser)
  if (!searchUser)
    return res.send(404);
  const data = { ...ExampleJsonResponse }

  let response = await db.query(`SELECT id,username,avatar_url 
	FROM main."user"
	where username ILIKE '%' || $1 || '%' `,[ 
    searchUser,
  ]);
  console.log(response.rows)
  if (response.rows.length < 1){
    data.statusCode = 1;
    data.errorCode = 30;
    data.error = ['Пользовател не найден'];
    return res.send(data);
  }
  data.data = response.rows

  return res.send(data)

})

router.get('/v1/user',async function(req, res){
  let userID = -1
  try {
    let jwtV = await jwt.verify(req.cookies.auth,SECRET_KEY)
    userID = jwtV.id
  } catch (error) {
    return res.send(401)
  }
  const data = { ...ExampleJsonResponse }
  let response = await db.query(`SELECT id, username,avatar_url 
	FROM main."user"
	where id = $1`,[
    userID,
  ]);

  let chats = await db.query(`SELECT id, author_id,companion_id 
	FROM main."message_channel"
	where author_id = $1 or companion_id = $1`,[
    userID,
  ]); 
  let dataB = {...response.rows[0]}
  dataB.chats = chats.rows;
  data.data = dataB
  res.send(data);
});

router.post('/v1/getChatInfo',async (req, res) => {
  let chatID = req.body.id
  if (!chatID){
    res.sendStatus(404)
    return;
  }
  const data = { ...ExampleJsonResponse }
  let channel_data = (await db.query(`SELECT id, author_id,companion_id 
	FROM main."message_channel"
	where id = $1`,[
    chatID,
  ])).rows[0];
  let author_data = (await db.query(`SELECT id, username,avatar_url 
	FROM main."user"
	where id = $1`,[
    channel_data.author_id,
  ])).rows[0];

  let companiom_data = (await db.query(`SELECT id, username,avatar_url 
	FROM main."user"
	where id = $1`,[
    channel_data.companion_id,
  ])).rows[0];

  let chat_messages = (await db.query(`SELECT message_channel_id, id, content, author_id
	FROM main.messages where message_channel_id = $1`,[
    chatID,
  ])).rows

  const _data = {
    author:author_data,
    companion:companiom_data,
    chatMessages:chat_messages,
  }
  data.data = _data
  res.send(data)
})


router.post('/v1/addChannel',async function(req, res){

  try {
    let jwtV = await jwt.verify(req.cookies.auth,SECRET_KEY)
    let userID = jwtV.id

    const room_id = await db.query("INSERT INTO main.message_channel(author_id, companion_id) VALUES ($1, $2) RETURNING id",[
      userID,
      req.body.userID,
    ]);

    let chats = await db.query(`SELECT id, author_id,companion_id 
    FROM main."message_channel"
    where author_id = $1 or companion_id = $1`,[
      userID,
    ]); 
    console.log(room_id.rows) 
    if (!global.socketIO.sockets.connected[req.cookies.io]) throw('socket not found');
    
    global.socketIO.sockets.connected[req.cookies.io].join('room_' + room_id.rows[0].id)
    const data = { ...ExampleJsonResponse }
    data.data = chats.rows
    return res.send(data);
  } catch (error) {
    return res.send(401)
  }

})

module.exports = router;
