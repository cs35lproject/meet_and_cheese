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

router
    .route('/detachMeeting')
    .delete(userController.detachMeeting);

module.exports = router;