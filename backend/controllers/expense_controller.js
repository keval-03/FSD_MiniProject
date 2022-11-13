const mysql = require("mysql2");
const connection = require("../db/connection.js").connection;


const expense_post = async (req,res)=>
{

    const group_id = req.body["group_id"]
    const activity_id = req.body["activity_id"]

    let result = await get_expense(group_id,activity_id)

    let ans = {"mapping":result}

    res.json(ans)

}


async function get_expense(group_id,activity_id)
{
    let table_name = `activities_${group_id}`
    let query = `SELECT * FROM ${table_name} WHERE activity_id=${activity_id}`
    let row = await connection.execute(query)
    row = row[0][0]
    console.log(row)

    table_name = `members_${group_id}`
    query = `SELECT user_id FROM ${table_name}`
    let ids = await connection.execute(query)
    ids = ids[0]
    console.log(ids)

    map = []
    
    for(i=0;i<ids.length;i++)
    {
        let pay = String(ids[i]["user_id"])+"_pay"
        let spent = String(ids[i]["user_id"])+"_spent"
        spent = row[`${spent}`]
        pay = row[`${pay}`]
        //console.log(row[`${spent}`])
        //console.log(row[`${pay}`])
        
        query = `SELECT user_email FROM MAIN_users WHERE user_id=${ids[i]["user_id"]}`
        let email = await connection.execute(query)
        email = email[0][0]["user_email"]
        //console.log(email[0][0]["user_email"])

        js={"spent":spent , "paid":pay , "user_email":email}
        map.push(js)
        //console.log(js)
    }

    //console.log(map)
    return map
}


module.exports = {expense_post}