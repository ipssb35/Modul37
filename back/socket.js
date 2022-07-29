var jwt = require('jsonwebtoken');
const SECRET_KEY = require('./config/secret.json').secret_auth_key;
var cookie = require('cookie')
const db = require('./util/database')

module.exports.connection = async (client,io) => {
    console.log('a user connected', client.id);

    const token = cookie.parse(client.request.headers.cookie).auth
    try{
        const jwtDecoded =  jwt.verify(token,SECRET_KEY)
        const authorID = jwtDecoded.id

        if (authorID){

            let chat_messages = (await db.query(`SELECT *
            FROM main.message_channel where author_id = $1 OR companion_id = $1`,[authorID])).rows 
            chat_messages.forEach(data => {
                client.join('room_' + data.id);
            })

            client.on('send_message',async (data,callback) => {
                const returnData = (await db.query(`INSERT INTO 
                    main.messages( message_channel_id, content, author_id ) VALUES ($1, $2, $3)
                    RETURNING id,message_channel_id, content, author_id`,
                    [data.channel_id,data.data,authorID]
                )).rows[0];
        
                io.to('room_' + data.channel_id).emit('on_message', returnData);
            })

        }

    }catch{}

    client.on('disconnect', async function() {
        console.log('a user disconnected', client.id);
    });
} 