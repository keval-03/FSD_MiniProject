const sql = require('mysql2')
require('dotenv').config();



const connection =  sql.createConnection({
    host : process.env.DB_HOST,
    user : process.env.DB_USERNAME,
    database : process.env.DB_NAME, 
    password : ''
})

module.exports = connection