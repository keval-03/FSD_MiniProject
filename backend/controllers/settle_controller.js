const connection = require('../db/connection').connection

const settle_post = async (req, res) => {


    if (req.body.task === "GET SETTLES") {
        const group_id = req.body["group_id"];
        const user_id = req.body["user_id"];

        //console.log(group_id,user_id)
        let ans = {};
        let [result] = await get_result(user_id, group_id)

        //console.log(result)

        result = await get_mails(result)

        res.json({ "mapping": result })
    }

    else if (req.body.task === "AMOUNT SETTLED") {

        const group_id = req.body["group_id"];
        const give_id = req.body["give_id"];
        const take_id = req.body["take_id"];
        const amount = req.body["amount"];

        console.log(group_id, give_id, take_id, amount)

        // insert in button table
        const inserted_id = await insert_button_table(group_id, give_id, take_id, amount)

        // insert in logs
        let table_name = `logs_${group_id}`
        let give_mail_id = await connection.execute(`SELECT user_email FROM MAIN_users WHERE user_id = ${give_id}`)
        give_mail_id = give_mail_id[0][0]["user_email"]

        let take_mail_id = await connection.execute(`SELECT user_email FROM MAIN_users WHERE user_id = ${take_id}`)
        take_mail_id = take_mail_id[0][0]["user_email"]

        //console.log(give_mail_id)
        let created = `${give_mail_id} settled an amount of ${amount} with ${take_mail_id}`

        let date = connection.execute(`SELECT NOW()`)
        date = date[0][0]["date"]

        let res = await connection.execute(`INSERT INTO ${table_name} VALUES ( ${take_id} , ${give_id} , "${created}" , '${date}' , ${inserted_id} ) `)

        res.json({ "button_id": inserted_id })
    }
}


async function get_result(user_id, group_id) {
    let table_name = `members_${group_id}`
    //console.log(table_name)

    let result = await connection.execute(`SELECT user_id , spent-paid as DIFF FROM ${table_name}`)
    result = result[0]
    //console.log(result)



    let [expense, ids] = get_sorted(result)
    //console.log(expense,ids)
    let ans = get_amount(expense, ids, user_id)

    //console.log("ANS--->",ans);

    return [ans];
}


function get_sorted(res) {

    let expense = [];
    let ids = [];

    for (i = 0; i < res.length; i++) {
        expense.push(res[i].DIFF);
        ids.push(res[i].user_id);
    }


    let flag = true;

    for (i = 0; i < expense.length; i++) {
        flag = true
        for (j = 1; j < expense.length; j++) {
            if (expense[j - 1] > expense[j]) {
                swap(expense, j);
                swap(ids, j);
                flag = false;
            }
        }

        if (flag == true) break;
    }

    mat = [expense, ids]
    return mat;
}


function swap(arr, index) {
    let temp = arr[index];
    arr[index] = arr[index - 1]
    arr[index - 1] = temp;
}


function get_amount(expense, ids, user_id) {
    let mat = [];
    let start = 0, end = expense.length - 1;

    while (start < end) {
        let json = {}
        if (Math.abs(expense[start]) < Math.abs(expense[end])) {
            json["give_id"] = ids[end]
            json["take_id"] = ids[start]
            json["amount"] = Math.abs(expense[start]);

            expense[end] = expense[end] + expense[start]
            expense[start] = 0

            if (ids[end] == user_id || ids[start] == user_id)
                mat.push(json)

            //console.log(json)
            start++;
        }

        else if (Math.abs(expense[start]) > Math.abs(expense[end])) {
            json["give_id"] = ids[end]
            json["take_id"] = ids[start]
            json["amount"] = Math.abs(expense[end]);

            expense[start] = expense[start] + expense[end];
            expense[end] = 0;

            if (ids[end] == user_id || ids[start] == user_id)
                mat.push(json)

            //console.log(json)

            end--;
        }

        else if (Math.abs(expense[start]) == Math.abs(expense[end])) {
            json["give_id"] = ids[end]
            json["take_id"] = ids[start]
            json["amount"] = Math.abs(expense[end]);

            expense[end] = 0;
            expense[start] = 0;

            if (ids[end] == user_id || ids[start] == user_id)
                mat.push(json)

            //console.log(json)

            start++;
            end--;
        }
    }
    return mat;
}



async function get_mails(result) {
    //console.log(result)
    let mails = []

    for (i = 0; i < result.length; i++) {
        let ans = await connection.execute(`SELECT user_email FROM MAIN_users WHERE user_id=${result[i].give_id}`);
        result[i]["give_mail"] = ans[0][0]["user_email"];

        ans = await connection.execute(`SELECT user_email FROM MAIN_users WHERE user_id=${result[i].take_id}`);
        result[i]["take_mail"] = ans[0][0]["user_email"];
    }

    //console.log(result)
    return result
}


async function insert_button_table(group_id, give_id, take_id, amount) {
    // for gives to by
    let table_name = `buttons_${group_id}`
    let result = await connection.execute(`INSERT INTO ${table_name} (take_id,give_id,amount) VALUES (${take_id},${give_id},${amount})`)
    result = result[0]["insertId"]

    table_name = `members_${group_id}`
    let query = `UPDATE ${table_name} SET paid = paid - ${amount} WHERE user_id=${take_id}`;
    console.log(query)
    let update = await connection.execute(query);

    query = `UPDATE ${table_name} SET spent = spent + ${amount} WHERE user_id=${give_id}`;
    console.log(query)
    update = await connection.execute(query)

    //console.log(result);
    return result;
}

module.exports = { settle_post }