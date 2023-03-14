const express = require("express");
const router = express.Router();
const userController = require('../controllers/userController');

router
    .route('/createUser')
    .post(userController.createUser);

router
    .route('/getUserMeetings')
    .get(userController.getUserMeetings);

router
    .route('/updateUserMeetings')
    .put(userController.updateUserMeetings);

module.exports = router;