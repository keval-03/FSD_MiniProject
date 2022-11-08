const express = require('express')
const mysql = require('mysql2')
const connection = require('../db/connection.js')

const home_post = (req,res)=>
{
    const {user_id} = req.params 
    //console.log(user_id)

    console.log(req.body)

    const q = 'SELECT group_id,group_name FROM MAIN_user__groups INNER JOIN MAIN_groups WHERE user_id='+mysql.escape(user_id);
    connection.query(q,(err,rows,fields)=>{

    })

    
}

module.exports = {home_post}