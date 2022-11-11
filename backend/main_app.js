// NODE JS MODULES
const express = require('express')
require('dotenv').config();
const app = express()
const cors = require('cors')

// PROJECT MODULES
const { connection, get_all } = require('./db/connection.js')
const { router } = require('./routes/routes.js')


// MAIN CODE
app.use(express.json());
app.use(cors());
app.use('/api/v1/', router);





// START
const start = async () => {
    try {
        // DATABASE CONNECTION 
        if (get_all()) console.log("DATABASE CONNECTED!!!")
        else console.log("SOMETHING WENT WRONG")

        // Connecting to PORT
        PORT_NUM = process.env.PORT || 3000
        app.listen(PORT_NUM, () => {
            console.log("App is listening at port ", PORT_NUM)
        })
    }
    catch (error) {
        console.log(error);
    }
}
start();