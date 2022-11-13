const connection = require('../db/connection').connection

const logs_post = async (req,res)=>
{

    if(req.body.task==="GET LOGS")
    {
        const user_id = req.body["user_id"]
        const group_id = req.body["group_id"]

        console.log(user_id,group_id)

        let result = await get_logs(user_id,group_id)

        res.json(result)
    }

    else if(req.body.task==="UNSETTLE")
    {
        const btn_id = req.body["btn_id"]
        const group_id = req.body["group_id"]

        // remove from buttons_[group_id] table
        let json = remove_and_log(group_id , btn_id)

        // update the amount
        await update_expense(group_id,json)

        res.send("UNSETTLE SUCCESSFUL")
    }
}



async function get_logs(user_id,group_id)
{
    let table_name = `logs_${group_id}`
    //console.log(table_name)

    let query = `SELECT * FROM ${table_name} WHERE for_id IS null OR for_id=${user_id}`;//WHERE for_id=NULL OR for_id=${user_id}`
    let res = await connection.execute(query)
    res = res[0]
    
    for(i=0;i<res.length;i++)
    {
        delete res[i].for_id;
        delete res[i].by_id;
    }
    //console.log(res);

    return res;
}


async function remove_and_log(group_id,btn_id)
{
    let table_name = `buttons_${group_id}`

    let query = `SELECT * FROM ${table_name} WHERE btn_id=${btn_id}`
    let result = await connection.execute(query);
    let json = result[0][0]

    //console.log(json)

    query = `DELETE FROM ${table_name} WHERE btn_id=${btn_id}`
    result = await connection.execute(query)

    await make_log(group_id,json)

    return json;
}


async function make_log( group_id , json )
{
    let table_name = `logs_${group_id}`
    console.log(json)
    
    let give_email = await connection.execute(`SELECT user_email FROM MAIN_users WHERE user_id=${json["for_id"]}`);
    give_email = give_email[0][0]["user_email"]
    let take_email = await connection.execute(`SELECT user_email FROM MAIN_users WHERE user_id=${json["by_id"]}`);
    take_email = take_email[0][0]["user_email"]
    console.log(give_email,take_email)

    let date = await connection.execute(`SELECT NOW()`)
    date = date[0][0]["NOW()"]

    let created = `${take_email} unsettled a payment of ${amount}`
    let query = `INSERT INTO ${table_name} VALUES ( ${json["by_id"]} , ${json["for_id"]},"${created}",${date},NULL) `
    let result = await connection.execute(query);

}


async function update_expense( group_id , json )
{
    let table_name = `members_${group_id}`

    let query = `UPDATE ${table_name} SET paid = paid - ${json["amount"]} WHERE user_id=${json["for_id"]}`
    let result = await connection.execute(query)

    query = `UPDATE ${table_name} SET paid = paid - ${json["amount"]} WHERE user_id=${json["by_id"]}`
    result = await connection.execute(query)
}


module.exports = {logs_post}