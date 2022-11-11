const mysql = require('mysql2')
const connection = require('../db/connection.js').connection

const activities_post = async (req,res)=>
{
    /*
    1.) Take activity ID , activity name, spent, paid, date
    2.) Take member_names 
    */ 
    if(req.body.task==="GET ACTIVITIES")
    {
        const user_id = req.body.user_id
        const group_id = req.body.group_id

        // 1.) Take activity ID , activity name, date, spent, paid
        const ans = {}
        const paid = String(user_id)+"_pay"
        const spent = String(user_id)+"_spent"
        
        let table_name = "activities_"+String(group_id)
        let query = ` SELECT activity_id, activity_name, activity_time, ${spent}, ${paid} FROM ${table_name}` 
        
            //console.log(paid,spent,table_name)
            //console.log(query)
        
        let result = await connection.execute(query)
            //console.log(result[0])
        ans["mapping"] = result[0]



        // 2.) Take member_names

        table_name = "members_"+String(group_id)
        query = `SELECT user_id FROM ${table_name}`
        member_names = []

        result = await connection.execute(query);
        //console.log(result[0].length)
        
        for(i=0;i<result[0].length;i++)
        {
            query = `SELECT user_email from MAIN_users WHERE user_id = ${result[0][i]["user_id"]}`

            let result2 = await connection.execute(query)
            member_names.push(result2[0][0]["user_email"])
        }
        //console.log(member_names)
        ans["member_names"] = member_names


        console.log(ans)
        res.json(ans)
    }
}

module.exports = {activities_post}