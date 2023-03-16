const express = require("express");
const router = express.Router();
const meetingController = require('../controllers/meetingController');

router
    .route('/getMeeting')
    .get(meetingController.getMeeting)

router
    .route('/createMeeting')
    .post(meetingController.createMeeting)

router
    .route('/updateMeeting')
    .put(meetingController.updateMeeting)
    
module.exports = router;