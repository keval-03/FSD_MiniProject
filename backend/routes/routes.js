const express = require('express')
const router = express.Router();


const {login_post} = require('../controllers/login_controllers')
const {signup_post} = require('../controllers/signup_controllers')

router.route('/login').post(login_post)
router.route('/signup').post(signup_post)


module.exports = {router}