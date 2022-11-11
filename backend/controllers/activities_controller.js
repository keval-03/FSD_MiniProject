const mysql = require('mysql2')
const connection = require('../db/connection.js').connection

const activities_post = async (req, res) => {
    /*
    1.) Take activity ID , activity name, spent, paid, date
    2.) Take member_names 
    */
    if (req.body.task === "GET ACTIVITIES") {
        const user_id = req.body.user_id
        const group_id = req.body.group_id

        // 1.) Take activity ID , activity name, date, spent, paid
        const ans = {}
        const paid = String(user_id) + "_pay"
        const spent = String(user_id) + "_spent"

        let table_name = "activities_" + String(group_id)
        let query = ` SELECT activity_id, activity_name, activity_time, ${spent}, ${paid} FROM ${table_name} ORDER BY activity_id DESC`

        //console.log(paid,spent,table_name)
        //console.log(query)

        let result = await connection.execute(query)
        //console.log(result[0])
        ans["mapping"] = result[0]



        // 2.) Take member_names

        table_name = "members_" + String(group_id)
        query = `SELECT user_id FROM ${table_name}`
        member_names = []

        result = await connection.execute(query);
        //console.log(result[0].length)

        for (i = 0; i < result[0].length; i++) {
            query = `SELECT user_email from MAIN_users WHERE user_id = ${result[0][i]["user_id"]}`

            let result2 = await connection.execute(query)
            member_names.push(result2[0][0]["user_email"])
        }
        //console.log(member_names)
        ans["member_names"] = member_names


        console.log(ans)
        res.json(ans)
    }



    /* 
    1.) Add activity name expenses
    2.) Add to Log table
    */
    else if (req.body.task === "NEW ACTIVITY") {
        const user_id = req.body.user_id
        const group_id = req.body.group_id
        const activity_name = req.body["activity_name"]
        const map = req.body["mapping"]
        //console.log(user_id,group_id,activity_name)
        //console.log(map)

        const ans = {}
        ans["activity_name"] = activity_name

        // 1.) Add activity name expenses
        let id_arr = []
        let paid_arr = []
        let spent_arr = []

        for (i = 0; i < map.length; i++) {
            let id = await connection.execute(`SELECT user_id FROM MAIN_users WHERE user_email="${map[i]["email"]}"`)

            if(id[0][0]["user_id"] === user_id)
            {
                ans["spent"] = map[i]["spent"]
                ans["paid"] = map[i]["pay"]
            }

            id_arr.push(id[0][0]["user_id"])
            //console.log(id[0][0]["user_id"])

            paid_arr.push(map[i]["pay"])
            //console.log(map[i]["pay"])

            spent_arr.push(map[i]["spent"])
            //console.log(map[i]["spent"])
        }
        //console.log(id_arr)
        //console.log(paid_arr)
        //console.log(spent_arr)

        let table_name = "activities_" + String(group_id)
        
        let query = await gen_query_insert(table_name, id_arr, paid_arr, spent_arr, activity_name)
        result = await connection.execute(query);
        let inserted_id = result[0]["insertId"]

        let date = await connection.execute("SELECT NOW()")
        date = date[0][0]["NOW()"]

        ans["activity_id"] = inserted_id
        ans["date"] = date


        //console.log(query)
        //console.log(result[0]["insertId"])

        console.log(ans)
        res.send("OK")
    }


}



async function gen_query_insert(table, id_arr, paid_arr, spent_arr, activity_name) {
    let query = `INSERT INTO ${table} (activity_name,activity_time`

    for (i = 0; i < id_arr.length; i++) {
        let pay = "," + String(id_arr[i]) + "_pay"
        //console.log(pay)
        let spent = "," + String(id_arr[i]) + "_spent"
        //console.log(spent)

        query = query + pay
        query = query + spent
    }

    let date = await connection.execute('SELECT NOW()')
    date = date[0][0]["NOW()"]
    //console.log(date)


    query = query + `) VALUES ("${activity_name}" , '${date}' `

    for (i = 0; i < id_arr.length; i++) {
        query = query + `, ${paid_arr[i]} , ${spent_arr[i]}`
    }
    query = query + `)`

    //console.log(query)
    return query
}



module.exports = { activities_post }

