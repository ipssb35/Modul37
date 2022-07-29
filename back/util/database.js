const { Client } = require('pg')
const cfg = require('../config/db.json')
const client = new Client(cfg.connection);
client.connect();
module.exports = client