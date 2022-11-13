const connection = require("../db/connection.js").connection;
const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");

/*

    1.) Email Password
    2.) Check if Email exists in the database 
    3.) If exists then return user already exists
    4.) Else Insert the email and password to DB

*/
/*const signup_get = (req,res)=>
{
    res.send("Signup GET")
}*/

const signup_post = async (req, res) => {
  let { user_email, user_password } = req.body;

  const [rows, cols] = await connection.query(
    "SELECT * FROM MAIN_users WHERE user_email=?",
    [user_email]
  );
  console.log(rows);

  if (rows.length == 0) {
    const salt = await bcrypt.genSalt();
    user_password = await bcrypt.hash(user_password, salt);
    //console.log(user_password)

    const [rows, cols] = await connection.query(
      "INSERT INTO MAIN_users (user_email,user_password) VALUES (?,?)",
      [user_email, user_password]
    );
    //console.log(rows)
    //console.log(rows.insertId)
    res.json({ user_id: rows.insertId });
  } else {
    res.json({ msg: "Account already exists!!!" });
  }
};

module.exports = { signup_post };