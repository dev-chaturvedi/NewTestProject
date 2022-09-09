const express = require("express");
const router = express.Router();
const admin = require("./adminRoute/adminRoute");
router.use("/admin", admin);
const user = require("./userRoute/userRoute");
const userKyc = require("./kycRoute/kycRoute")
router.use("/user",user);
router.use("/userKyc",userKyc)
// const staticPageRouter = require('./staticPageRouter');
// router.use('/staticPageRouter',staticPageRouter);
module.exports = router;
