const sql = require('mysql2');
require('dotenv').config();



const connection =  sql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}).promise()


const get_all = async ()=>
{
    const [rows,cols] = await connection.query("SELECT * FROM MAIN_users LIMIT 1")
    //console.log(rows.length);
    if(rows.length>0!=undefined) return true;
    else return false;
}

module.exports = {connection,get_all}