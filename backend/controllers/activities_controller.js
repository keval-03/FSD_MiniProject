const mysql = require('mysql2')
const connection = require('../db/connection.js').connection

const activities_post = (req,res)=>
{
    /*
    1.) Take activity ID , activity name, spent, paid, date
    2.) user_e
    */ 
    if(req.body.task==="GET ACTIVITIES")
    {
        const user_id = req.body.user_id
        const group_id = req.body.group_id

        const query = `  ` 

    }
}

module.exports = {activities_post}