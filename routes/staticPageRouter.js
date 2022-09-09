const router = require('express').Router();
const staticController = require('../controller/staticPageController')
const staticPage = require('../model/staticModel')

router.post('/staticPageView',staticController.staticPageView)
router.post('/staticPageUpdate',staticController.staticPageUpdate)


module.exports = router;