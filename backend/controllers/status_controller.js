const mysql = require("mysql2");
const connection = require("../db/connection.js").connection;

const status_post = async (req, res) => {

    const group_id = req.body["group_id"]

    result = await get_status_result(group_id)
    console.log(result)
    let ans = { "mapping": result }

    res.json(ans)
}


async function get_status_result(group_id) {
    let table_name = `members_${group_id}`
    let query = `SELECT * FROM ${table_name}`

    let result = await connection.execute(query)
    result = result[0]
    //console.log(result)

    mapping = []

    for (i = 0; i < result.length; i++) {
        query = `SELECT user_email FROM MAIN_users WHERE user_id=${result[i]["user_id"]}`
        let email = await connection.execute(query);
        email = email[0][0]["user_email"]
        js = { "user_email": email, "paid": result[i]["paid"], "spent": result[i]["spent"] }

        mapping.push(js)
    }
    //console.log(mapping)
    return mapping;
}


module.exports = { status_post }