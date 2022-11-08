// NODE JS MODULES
const express = require('express')
require('dotenv').config();
const app = express()
const cors  =require('cors')

// PROJECT MODULES
const connection = require('./db/connection.js')
const {router} = require('./routes/routes.js')


// MAIN CODE
app.use(express.json());
app.use(cors());
app.use('/api/v1/',router);





// START
const start = async ()=>
{
    try{
            // DATABASE CONNECTION 
            connection.connect((err)=>
            {
                if(err){
                    console.log(err)
                }
                else 
                {
                    /*connection.query("SELECT * from MAIN_users",function(err,rows,fields)
                    {
                        console.log(rows);
                    })*/
                    console.log("Database Connected Successfully!!!!!");
                }
            })
        
            // Connecting to PORT
            PORT_NUM = process.env.PORT||3000
            app.listen(PORT_NUM,()=>
            {
                console.log("App is listening at port ",PORT_NUM)
            })
    }
    catch(error){
            console.log(error);
    }
}
start();