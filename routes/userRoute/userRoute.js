const express = require('express');
const router = express.Router();
const { signup } = require('../../controller/userController');
const { verifyOtp } = require('../../controller/userController');
const {forgotPassword} = require('../../controller/userController');
const { signupComplete } = require('../../controller/userController');
const { checkUserName } = require('../../controller/userController');
const { checkUserNameOrEmail } = require('../../controller/userController');
const {postRegistration} =  require('../../controller/userController')
const {login} = require('../../controller/userController')


router.post('/signup',signup);
router.post('/verifyOtp',verifyOtp);
router.post('/forgotPassword',forgotPassword);
router.post('/signupComplete',signupComplete);
router.post('/checkUserName',checkUserName);
router.post('/checkUserNameOrEmail',checkUserNameOrEmail);
router.post('/postRegistration', postRegistration)
router.post('/login',login)

module.exports = router;