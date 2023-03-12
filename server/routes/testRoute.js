const express = require("express");
const router = express.Router();
const testController = require('../controllers/testController');

router
    .route('/getTest')
    .get(testController.getTest)

router
    .route('/postTest')
    .post(testController.postTest)

module.exports = router;