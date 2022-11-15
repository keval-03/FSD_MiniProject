const connection = require('../db/connection').connection

const logs_post = async (req,res)=>
{

    if(req.body.task==="GET LOGS")
    {
        const user_id = req.body["user_id"]
        const group_id = req.body["group_id"]

        console.log(user_id,group_id)

        let result = await get_logs(user_id,group_id)

        let js = {"mapping":result};
        console.log(js)
        res.json(js)
    }

    else if(req.body.task==="UNSETTLE")
    {
        const btn_id = req.body["btn_id"]
        const group_id = req.body["group_id"]

        console.log(btn_id)
        // remove from buttons_[group_id] table
        let json = await remove_and_log(group_id , btn_id)

        // update the amount
        await update_expense(group_id,json)

        res.send("UNSETTLE SUCCESSFUL")
    }
}



async function get_logs(user_id,group_id)
{
    let table_name = `logs_${group_id}`
    //console.log(table_name)

    let query = `SELECT * FROM ${table_name}` 
    let res = await connection.execute(query)
    res = res[0]
    //console.log(res)

    let ans = []
    for(i=0;i<res.length;i++)
    {
        if(res[i]["for_id"]==null || res[i]["for_id"]==user_id || res[i]["by_id"]==user_id)
        {
            delete res[i].for_id;
            delete res[i].by_id;
            ans.push(res[i])
        }

        else continue;
    }
    //console.log(ans);

    return ans;
}


async function remove_and_log(group_id,btn_id)
{
    let table_name = `buttons_${group_id}`

    let query = `SELECT * FROM ${table_name} WHERE btn_id=${btn_id}`
    console.log(query);
    let result = await connection.execute(query);
    let json = result[0][0]
    
    //console.log(json)
    await delete_from_logs(group_id,json)
    await make_log(group_id,json)
    query = `DELETE FROM ${table_name} WHERE btn_id=${btn_id}`
    console.log(query)
    result = await connection.execute(query)


    return json;
}


async function make_log( group_id , json )
{
    let table_name = `logs_${group_id}`
    console.log(json)
    
    let give_email = await connection.execute(`SELECT user_email FROM MAIN_users WHERE user_id=${json["give_id"]}`);
    give_email = give_email[0][0]["user_email"]
    let take_email = await connection.execute(`SELECT user_email FROM MAIN_users WHERE user_id=${json["take_id"]}`);
    take_email = take_email[0][0]["user_email"]
    console.log(give_email,take_email)

    let date = await connection.execute(`SELECT NOW()`)
    date = date[0][0]["NOW()"]

    let created = `${take_email} unsettled a payment of ${json["amount"]}`
    let query = `INSERT INTO ${table_name} VALUES ( ${json["take_id"]} , ${json["give_id"]},"${created}",'${date}',NULL) `
    console.log(query)
    let result = await connection.execute(query);

}


async function update_expense( group_id , json )
{
    let table_name = `members_${group_id}`

    console.log(json);
    let query = `UPDATE ${table_name} SET paid = paid - ${json["amount"]} WHERE user_id=${json["give_id"]}`
    let result = await connection.execute(query)

    query = `UPDATE ${table_name} SET paid = paid + ${json["amount"]} WHERE user_id=${json["take_id"]}`
    result = await connection.execute(query)
}


async function delete_from_logs(group_id,json)
{

    let table_name=`logs_${group_id}`

    let query = `DELETE FROM ${table_name} WHERE btn_id=${json["btn_id"]}`;
    console.log(query)
    let res = await connection.execute(query);

}


module.exports = {logs_post}