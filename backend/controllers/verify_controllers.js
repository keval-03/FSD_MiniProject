const connection = require('../db/connection').connection
const bcrypt = require('bcrypt')
const {server_path} = require('../../config.js')

const verify_get = async (req,res)=>
{

    console.log("INSIDE VERIFY!!!")
    const email = req.params.email
    let password = req.params.password

    password = password.slice(1, password.length - 1);
    console.log(password)

    console.log(email, password)

    const salt = await bcrypt.genSalt();
    password = await bcrypt.hash(password, salt);

    console.log(password)

    let result = await connection.execute(`INSERT INTO MAIN_users (user_email,user_password,verified) VALUES (${email},"${password}",1)`)
    console.log("INSERTED ID:" + result)

    console.log(server_path+"/login.html")
    res.redirect(server_path+"/login.html");

}

module.exports = {verify_get}