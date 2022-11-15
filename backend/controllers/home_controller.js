const mysql = require("mysql2");
const connection = require("../db/connection.js").connection;

const home_post = async (req, res) => {
  if (req.body.task === "GET GROUPS") {
    const user_id = req.body.user_id;
    //console.log(user_id)

    const result = await connection.execute(
      "SELECT group_id FROM MAIN_users__groups WHERE user_id=?",
      [user_id]
    );
    //console.log(result[0]);

    let user_email = await connection.execute(
      "SELECT user_email from MAIN_users WHERE user_id=?",
      [user_id]
    );
    user_email = user_email[0][0]["user_email"];

    ans = {};
    arr = [];

    for (i = 0; i < result[0].length; i++) {
      const grp_id = result[0][i].group_id;
      // console.log(grp_id)

      const rows = await connection.query("CALL get_grp_id_name(?)", [grp_id]);

      let table_name = "members_" + grp_id;
      query = "SELECT spent,paid FROM " + table_name + " WHERE user_id=?";
      const paid_spent = await connection.query(query, [user_id]);
      //console.log(paid_spent[0][0]["paid"])
      rows[0][0][0]["spent"] = paid_spent[0][0]["spent"];
      rows[0][0][0]["paid"] = paid_spent[0][0]["paid"];

      console.log(rows[0][0][0]);
      arr.push(rows[0][0][0]);
    }
    ans["mapping"] = arr;
    ans["user_email"] = user_email;
    //console.log(ans);
    res.json(ans);
  }

  // if making a new group
  // first find the user_ids by email and if the email is wrong then dont make the group
  // when all the emails are right then give group entry in MAIN_groups table
  // then do the mapping of user_id and group_id in MAIN_users__groups table
  // then create the
  // members_[group_id] table --> user_id , spent , paid
  // buttons_[group_id] table --> by_id , for_id , amount , state
  // activities_[group_id] table --> activity_id, activity_name , A_pay , A_spent .....
  // announcements_[group_id] table --> by_id , announcement , dtime
  // logs_[group_id] table  --> by_id , for_id , logs , dtime
  else if (req.body.task === "MAKE GROUP") {
    //console.log(req.body)
    const { user_id, group_name, member_mails } = req.body;
    right_json = {};
    //console.log(user_id)
    //console.log(group_name)
    //console.log(member_mails)

    // first find the user_ids by email and if the email is wrong then dont make the group
    let ids_array = [];
    let present = true;

    console.log(member_mails)
    for (i = 0; i < member_mails.length; i++) 
    {
      let query = `SELECT user_id from MAIN_users WHERE user_email = '${member_mails[i]}'`
      console.log(query)
      let result = await connection.execute(query)
      console.log("RESULT-->",result)
      result = result[0][0]
      

      if (result == undefined) {
        ids_array.push(-1);
        console.log("Undefined")
        present = false;
      } 
      else 
      {
        ids_array.push(result["user_id"]);
      }
    }
    //console.log(ids_array)
    if (present == false)
    {
      res.json({msg:"Wrong emails provided!!!", id_list:ids_array});
      return;
      
    }

    // when all the emails are right then give group entry in MAIN_groups table
    let [rows,cols] = await connection.execute(
      "INSERT INTO MAIN_groups (group_name) VALUES (?)",
      [group_name]
    );
    //console.log("ID OF GROUP INSERTED IS: ", rows["insertId"])
    right_json["group_id"] = rows["insertId"];
    //console.log(right_json["group_id"])
    //console.log(ids_array)
    
    flag = false
    // then do the mapping of user_id and group_id in MAIN_users__groups table
    for (i = 0; i < ids_array.length; i++) {
      if (ids_array[i] == user_id) flag = true;
      [rows, cols] = await connection.execute("CALL insert_user_id_group_id(?,?)", [ids_array[i], right_json["group_id"]]);
    }
    if (flag == false) ids_array.push(user_id);

    // members_[group_id] table --> user_id , spent , paid
    //console.log("members_"+String(right_json["group_id"]))
    let table_name = "members_" + String(right_json["group_id"]);
    let query =
      "CREATE TABLE " +
      table_name +
      " (user_id INTEGER , paid INTEGER, spent INTEGER,FOREIGN KEY (user_id) REFERENCES MAIN_users(user_id) )";

    let result = await connection.execute(query);
    //console.log("Members Made")

    query = "INSERT INTO " + table_name + " VALUES(?,0,0)";
    for (i = 0; i < ids_array.length; i++) {
      [rows, cols] = await connection.execute(query, [ids_array[i]]);
    }
    //console.log("DONE")

    // buttons_[group_id] table --> by_id , for_id , amount , state
    table_name = "buttons_" + String(right_json["group_id"]);
    let table_name_2 = "members_" + String(right_json["group_id"]);
    query =
      "CREATE TABLE " +
      table_name +
      " (btn_id INTEGER PRIMARY KEY AUTO_INCREMENT,take_id INTEGER, give_id INTEGER, amount INTEGER, FOREIGN KEY (take_id) REFERENCES " + table_name_2 + "(user_id), FOREIGN KEY (give_id) REFERENCES " + table_name_2 + "(user_id) )";
    //console.log(query)
    result = await connection.execute(query);
    // cosnole.log(rows)

    // activities_[group_id] table --> activity_id, activity_name , A_pay , A_spent .....
    table_name = "activities_" + String(right_json["group_id"]);
    q =
      "CREATE TABLE " +
      table_name +
      " (activity_id INTEGER PRIMARY KEY AUTO_INCREMENT, activity_name VARCHAR(255), activity_time VARCHAR(2048)";

    for (i = 0; i < ids_array.length; i++) {
      q =
        q +
        ", " +
        String(ids_array[i]) +
        "_pay" +
        " INTEGER, " +
        String(ids_array[i]) +
        "_spent" +
        " INTEGER";
    }
    q = q + ")";
    //console.log(table_values)
    //console.log(q)
    result = await connection.execute(q);

    console.log("announcements_" + String(right_json["group_id"]));
    // announcements_[group_id] table --> by_id , announcement , dtime
    table_name = "announcements_" + String(right_json["group_id"]);
    table_name_3 = "buttons_" + String(right_json["group_id"]);

    query =
      "CREATE TABLE " +
      table_name +
      " ( by_id INTEGER ,announcement VARCHAR(3000) , dtime VARCHAR(2048), FOREIGN KEY (by_id) references " +
      table_name_2 +
      "(user_id) )";
    result = await connection.execute(query);

    // logs_[group_id] table  --> by_id , for_id , logs , dtime
    //console.log("logs_"+String(right_json["group_id"]))
    table_name = "logs_" + String(right_json["group_id"]);
    query =
      "CREATE TABLE " +
      table_name +
      " ( by_id INTEGER , for_id INTEGER DEFAULT NULL,  logs VARCHAR(3000) , dtime VARCHAR(2048), btn_id INTEGER , FOREIGN KEY (by_id) references " +
      table_name_2 +
      "(user_id) , FOREIGN KEY (for_id) references " +
      table_name_2 +
      "(user_id) , FOREIGN KEY (btn_id) references " +
      table_name_3 +
      "(btn_id) )";
    result = await connection.execute(query);

    // INSERTING VALUES IN LOGS
    let user_email = await connection.execute(
      "SELECT user_email from MAIN_users WHERE user_id=?",
      [user_id]
    );
    let dt = await connection.execute("SELECT NOW()");
    dt = dt[0][0]["NOW()"];

    console.log(user_id, group_name, user_id, dt);

    user_email = user_email[0][0]["user_email"];
    created = `"GROUP ${group_name} CREATED BY ${user_email}"`;
    query = `INSERT INTO ${table_name} VALUES (${user_id},NULL,${created},'${dt}',NULL)`;

    result = await connection.execute(query);
    //console.log(result)

    for (i = 0; i < ids_array.length - 1; i++) {
      let user_email = await connection.execute(
        "SELECT user_email from MAIN_users WHERE user_id=?",
        [ids_array[i]]
      );
      let dt = await connection.execute("SELECT NOW()");
      dt = dt[0][0]["NOW()"];
      user_email = user_email[0][0]["user_email"];

      created = `"${user_email} is added to the group"`;
      query = `INSERT INTO ${table_name} VALUES (${ids_array[i]},NULL,${created},'${dt}',NULL)`;
      result = await connection.execute(query);
    }

    right_json["group_name"] = group_name;
    res.json(right_json);
  }
};

module.exports = { home_post };
