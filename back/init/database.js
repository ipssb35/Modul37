const { Client } = require('pg')
const cfg = require('../config/db.json').connection
var fs = require('fs');

let client = new Client({
    user: cfg.user,
    host:cfg.host,
    password: cfg.password,
    port: cfg.port,
});
client.connect();
async function CreateDB(){
    await client.query(`DROP DATABASE IF EXISTS "${cfg.database}"`);
    await client.query(`CREATE DATABASE "${cfg.database}"
    WITH 
    OWNER = "${cfg.user}"
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1;`);

    client = require('../util/database');
}

async function CreateTables(){
    console.log('creating Scheme for database...')
    var data = await fs.readFileSync('./database_dist/scheme.sql', "utf8");
    await client.query(data);
    console.log('Scheme `main` creating!')

}

(async () => {
    try{
        console.log(`create database "${cfg.database}"`)
        await CreateDB();
        await CreateTables();
        await client.end();
        console.log('database creating!')
    }catch(err){
        console.error(err);
    }
    
    process.exit(1)
})();

