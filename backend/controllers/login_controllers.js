const connection = require('../db/connection.js')
const mysql = require('mysql2')
const bcrypt = require('bcrypt')


// TASK
/*
Email
Password

ID is present

Email --> exist
password --> true
Entry --> y

Email --> exist
Password --> false
Msg --> "Wrong User Credentials!!!!"

Email --> not exists
Password --> any
Msg --> "Account does not exists. Please signup"

*/


// authorize the data
const login_post = (req, res) => {
    console.log("POST to login")

    //if the req has id
    if (req.body["user_id"] != undefined) {
        let { user_id } = req.body
        connection.query("SELECT * FROM MAIN_users WHERE user_id=" + mysql.escape(user_id), function (err, rows, fields) {
            if (err) console.log(err);

            else {
                // if the user with the id does not exist then return error message
                if (rows.length == 0) res.json({ "msg": "Something went wrong, please login again!!" })

                // if the user exists then return change page message
                else res.json({ change_page: 1, user_id: rows.user_id});
            }
        })
    }

    else {
        let { user_email, user_password } = req.body;
        //console.log(user_email,user_password)

        connection.query("SELECT * FROM MAIN_users WHERE user_email=" + mysql.escape(user_email), async function (err, rows, fields) {
            if (err) console.log(err);

            else {
                console.log(rows)
                //console.log(rows,rows.length)
                // if the email is wrong or if it does not exists then no entry would be found and message will be returned 
                if (rows.length == 0) res.json({ "msg": "Account does not exists. Please signup" })

                // if the email is correct but the password doesn't matches
                //else if (await bcrypt.compare(user_password, rows[0].user_password) == false) res.json({ "msg": "Wrong User Credentials!!!!" })

                // if both the email and the password matched then take to home page
                else res.json({ change_page: 1 , user_id:rows[0].user_id})
            }
        })
    }

}





module.exports = { login_get, login_post }