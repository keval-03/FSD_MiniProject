const sql = require('mysql2');
require('dotenv').config();



<<<<<<< HEAD
const connection =  sql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}).promise()
=======
const connection =  sql.createConnection({
    host : process.env.DB_HOST,
    user : process.env.DB_USERNAME,
    database : process.env.DB_NAME, 
    password : ''
})
>>>>>>> 9a76fd4077474ec38dcf0eaca75f4157a35d29ae


const get_all = async ()=>
{
    const [rows,cols] = await connection.query("SELECT * FROM MAIN_users LIMIT 1")
    //console.log(rows.length);
    if(rows.length>0!=undefined) return true;
    else return false;
}

module.exports = {connection,get_all}