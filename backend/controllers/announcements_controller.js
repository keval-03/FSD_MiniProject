const mysql = require("mysql2");
const connection = require("../db/connection.js").connection;

const announcement_post = async (req, res) => {
    const group_id = req.body["group_id"]
    const ans = {}
    /*
    1.) take announcement
    2.) email
    3.) 
    */
    if (req.body.task === "GET ANNOUNCEMENTS") {
        let result = await get_all_announcements(group_id)
        //console.log(result);
        ans["mapping"] = result
        res.json(ans);
    }


    else if (req.body.task === "MAKE ANNOUNCEMENTS") {

        const user_id = req.body["user_id"]
        const announcement = req.body["announcement"]
        let result = await make_announcement(group_id, user_id, announcement)

        console.log(result)
        res.json(result);
    }
}


async function get_all_announcements(group_id) {
    let table_name = `announcements_${group_id}`
    let query = `SELECT * FROM ${table_name}`
    let mapping = []

    let result = await connection.execute(query)
    //console.log(result[0])

    for (i = 0; i < result[0].length; i++) {
        js = {}
        console.log(result[0][i])

        let user_name = await connection.execute(`SELECT user_email FROM MAIN_users WHERE user_id=${result[0][i]["by_id"]}`)
        user_name = user_name[0][0]["user_email"]
        //console.log(user_name)

        let date_time = result[0][i]["dtime"]
        //console.log(date_time)

        let announcement = result[0][i]["announcement"]

        js["user_name"] = user_name;
        js["date_time"] = date_time;
        js["announcement"] = announcement

        mapping.push(js)
    }

    //console.log(mapping)
    return mapping;
}



async function make_announcement(group_id, user_id, announcement) {
    let user_name = await connection.execute(`SELECT user_email FROM MAIN_users WHERE user_id=${user_id}`)
    user_name = user_name[0][0]["user_email"]
    //console.log(user_name)

    let date_time = await connection.execute(`SELECT NOW()`)
    date_time = date_time[0][0]["NOW()"]
    //console.log(date_time)

    let table_name = `announcements_${group_id}`
    let query = `INSERT INTO ${table_name} VALUES(${user_id},"${announcement}",'${date_time}')`
    //console.log(query)

    let result = await connection.execute(query)

    table_name = `logs_${group_id}`
    query = `INSERT INTO ${table_name} VALUES (${user_id},NULL,"${user_name} made an announcement",'${date_time}',NULL)`
    result = await connection.execute(query);

    js = {"user_name":user_name,"date_time":date_time}
    return js;
}


module.exports = { announcement_post }