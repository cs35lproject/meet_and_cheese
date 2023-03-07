const express = require("express");
const router = express.Router();
const eventController = require('../controllers/eventController');

router
    .route('/createEvent')
    .post(eventController.createEvent);

router
    .route('/deleteEvent')
    .post(eventController.deleteEvent);

router
    .route('/joinEvent')
    .post(eventController.joinEvent);

router
    .route('/leaveEvent')
    .post(eventController.leaveEvent);

module.exports = router;