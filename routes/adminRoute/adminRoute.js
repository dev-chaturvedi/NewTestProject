const express = require("express");
const router = express.Router();
const { login } = require("../../controller/adminController");
const { getProfile } =require( '../../controller/adminController');
const { getUser } =require( '../../controller/adminController')
const { userManagement } =require( '../../controller/adminController')

const {forgotPassword} =require("../../controller/adminController");
const {resetPassword} =require("../../controller/adminController")
const {changePassword} = require("../../controller/adminController");
// const { verifyToken } = require("../../middleware/auth");
const { loginValidation } = require("../../middleware/validation");
const { addFaq } =require( '../../controller/adminController')
const { editFaq } =require( '../../controller/adminController')
const { deleteFaq } =require( '../../controller/adminController')
const { viewFaq } =require( '../../controller/adminController')


router.post("/login", loginValidation, login);
router.get("/getProfile", getProfile);
router.post("/getUser", getUser)
router.post("/userManagement",userManagement)
router.post("/forgotPassword",forgotPassword);
router.post("/resetPassword", resetPassword);
router.post("/changePassword", changePassword)
router.post('/addFaq',addFaq)
router.post('/editFaq',editFaq)
router.post('/deleteFaq',deleteFaq)
router.post('/viewFaq',viewFaq)


module.exports = router;
