const express = require('express')
const router = express.Router();


const { login_post } = require('../controllers/login_controllers.js')
const { signup_post } = require('../controllers/signup_controllers.js')
const { home_post } = require('../controllers/home_controller.js')
const { activities_post } = require('../controllers/activities_controller');
const { announcement_post } = require('../controllers/announcements_controller.js');
const { status_post } = require('../controllers/status_controller.js');
const { expense_post } = require('../controllers/expense_controller.js');
const {settle_post} = require('../controllers/settle_controller')


router.route('/login').post(login_post)
router.route('/signup').post(signup_post)
router.route('/home').post(home_post)
router.route('/activities').post(activities_post)
router.route('/announcements').post(announcement_post)
router.route('/status').post(status_post)
router.route('/expense').post(expense_post)
router.route('/settle').post(settle_post)


module.exports = { router }