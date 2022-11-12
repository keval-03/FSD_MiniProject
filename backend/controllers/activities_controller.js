const mysql = require("mysql2");
const connection = require("../db/connection.js").connection;

const activities_post = async (req, res) => {
  /*
    1.) Take activity ID , activity name, spent, paid, date
    2.) Take member_names 
    */
  if (req.body.task === "GET ACTIVITIES") {
    const user_id = req.body.user_id;
    const group_id = req.body.group_id;
    console.log(user_id);
    console.log(group_id);
    // 1.) Take activity ID , activity name, date, spent, paid
    const ans = {};
    const paid = String(user_id) + "_pay";
    const spent = String(user_id) + "_spent";

    let table_name = "activities_" + String(group_id);
    let query = ` SELECT activity_id, activity_name, activity_time, ${spent}, ${paid} FROM ${table_name} ORDER BY activity_id DESC`;

    //console.log(paid,spent,table_name)
    //console.log(query)

    let result = await connection.execute(query);
    console.log(result[0]);
    mapping = [];
    console.log(result[0].length);
    for (i = 0; i < result[0].length; i++) {
      js = {};
      js["activity_id"] = result[0][i]["activity_id"];
      js["activity_name"] = result[0][i]["activity_name"];
      js["activity_time"] = result[0][i]["activity_time"];
      js["paid"] = result[0][i][String(user_id) + "_pay"];
      js["spent"] = result[0][i][String(user_id) + "_spent"];
      mapping.push(js);
    }
    ans["mapping"] = mapping;

    // 2.) Take member_names

    table_name = "members_" + String(group_id);
    query = `SELECT user_id FROM ${table_name}`;
    member_names = [];

    result = await connection.execute(query);
    //console.log(result[0].length)

    for (i = 0; i < result[0].length; i++) {
      query = `SELECT user_email from MAIN_users WHERE user_id = ${result[0][i]["user_id"]}`;

      let result2 = await connection.execute(query);
      member_names.push(result2[0][0]["user_email"]);
    }
    //console.log(member_names)
    ans["member_names"] = member_names;
    ans["group_name"] = await get_group_name(group_id)
    console.log(ans);
    res.json(ans);
  } else if (req.body.task === "NEW ACTIVITY") {
    /* 
    1.) Add activity name expenses
    2.) Add to Log table
    */
    const user_id = req.body.user_id;
    const group_id = req.body.group_id;
    const activity_name = req.body["activity_name"];
    const map = req.body["mapping"];
    console.log(user_id, group_id, activity_name);
    //console.log(map)

    const ans = {};
    ans["activity_name"] = activity_name;

    // 1.) Add activity name expenses
    let id_arr = [];
    let paid_arr = [];
    let spent_arr = [];

    for (i = 0; i < map.length; i++) {
      let id = await connection.execute(
        `SELECT user_id FROM MAIN_users WHERE user_email="${map[i]["email"]}"`
      );

      console.log(id[0][0]["user_id"]);
      if (id[0][0]["user_id"] == user_id) {
        ans["spent"] = map[i]["spent"];
        ans["paid"] = map[i]["paid"];
      }

      id_arr.push(id[0][0]["user_id"]);
      //console.log(id[0][0]["user_id"])

      paid_arr.push(map[i]["paid"]);
      //console.log(map[i]["pay"])

      spent_arr.push(map[i]["spent"]);
      //console.log(map[i]["spent"])

      await update_members(group_id, map[i]["paid"], map[i]["spent"], id[0][0]["user_id"])
    }
    //console.log(id_arr)
    //console.log(paid_arr)
    //console.log(spent_arr)

    let table_name = "activities_" + String(group_id);

    let query = await gen_query_insert(
      table_name,
      id_arr,
      paid_arr,
      spent_arr,
      activity_name
    );
    result = await connection.execute(query);
    let inserted_id = result[0]["insertId"];

    let date = await connection.execute(`SELECT activity_time FROM ${table_name}`);
    date = date[0][0]["activity_time"];
    console.log(date)

    ans["activity_id"] = inserted_id;
    ans["activity_time"] = date;

    //console.log(query)
    //console.log(result[0]["insertId"])

    table_name = "logs_" + String(group_id);
    query = `INSERT INTO ${table_name} VALUES(${user_id},NULL,"Expense for ${activity_name} was added ","${date}")`;
    result = connection.execute(query);

    console.log(ans);
    res.json(ans);
  }
};

async function gen_query_insert(
  table,
  id_arr,
  paid_arr,
  spent_arr,
  activity_name
) {
  let query = `INSERT INTO ${table} (activity_name,activity_time`;

  for (i = 0; i < id_arr.length; i++) {
    let pay = "," + String(id_arr[i]) + "_pay";
    //console.log(pay)
    let spent = "," + String(id_arr[i]) + "_spent";
    //console.log(spent)

    query = query + pay;
    query = query + spent;
  }

  let date = await connection.execute("SELECT NOW()");
  date = date[0][0]["NOW()"];
  console.log("date", date)

  query = query + `) VALUES ("${activity_name}" , '${date}' `;

  for (i = 0; i < id_arr.length; i++) {
    query = query + `, ${paid_arr[i]} , ${spent_arr[i]}`;
  }
  query = query + `)`;

  //console.log(query)
  return query;
}


async function update_members(group_id, paid, spent, user_id) {
  let table_name = "members_" + String(group_id);
  query = `UPDATE ${table_name} SET paid = paid+${paid} , spent = spent+${spent} WHERE user_id=${user_id}`

  result = await connection.execute(query)
  console.log(`Updated for ${user_id}`)
}


async function get_group_name(group_id) {
  let query = `SELECT group_name FROM MAIN_groups WHERE group_id=${group_id}`
  result = await connection.execute(query);
  //console.log(result[0][0]["group_name"])

  return result[0][0]["group_name"]
}

module.exports = { activities_post };
