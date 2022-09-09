const express = require('express');
const router = express.Router();



const kycController = require('../../controller/kycController');


router.post('/uploadKyc',kycController.uploadKyc);

module.exports = router;