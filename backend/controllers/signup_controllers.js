const connection = require('../db/connection.js')
const express = require('express')
const mysql = require('mysql2')

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


const signup_post = (req,res)=>
{
    let {user_email,user_password} = req.body;
    connection.query("SELECT * FROM MAIN_users WHERE user_email="+mysql.escape(user_email),async function (err, rows, fields) {
        if (err) console.log(err);

        else {
           console.log(rows)
           
           if(rows.length==0)
           {
                connection.query("INSERT INTO MAIN_users (user_email,user_password) VALUES ("+ mysql.escape(user_email) + ","+ mysql.escape(user_password) +")")
           }

           else
           {
            res.json({"msg":"Account already exists!!!"})
           }
        }
    })
}

module.exports = {signup_get,signup_post}