const connection = require("../db/connection.js").connection;
const nodemailer = require('nodemailer')

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

  if (rows.length == 0 || rows["verified"]==0) {
    
    let url = prepare_url(user_email, user_password)

    SendMail(user_email, url)

    res.json({ "msg": "EMAIL IS SENT TO YOUR EMAIL ID. PLEASE GO AND VERIFY!!!!" })

  } 
  else {
    return res.json({ msg: "Account already exists!!!" });
  }
};


function prepare_url(email, password) {
  let url = `http://localhost:3005/api/v1/verify/"${email}"&"${password}"`;
  console.log(url)
  return url;
}


function SendMail(email, url) {
  var Transport = nodemailer.createTransport({

      service: "Gmail",
      auth:
      {
          user: process.env.MAIL_ID,
          pass: process.env.MAIL_PASSWORD
      }

  });


  var mailOptions = {
      from: "Expense Manager",
      to: email,
      subject: "USER AUTHENTICATION FOR EXPENSE MANAGER",
      html: `
      <p>Press the link below OR pastle the link in URL only if you have signed up for Expense Manager</p><br>
      <p>
      <a href='${url}'>LINK</a>
      </p> 
      <p>
      Thanks 
      </p>
      `
  };

  Transport.sendMail(mailOptions, function (error, response) {
      if (error) console.log(error);
      else console.log("Message Sent")
  });


}





module.exports = { signup_post };