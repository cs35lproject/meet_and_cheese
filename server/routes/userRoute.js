const express = require("express");
const router = express.Router();
const userController = require('../controllers/userController');

router
    .route('/createUser')
    .post(userController.createUser);

router
    .route('/deleteUser')
    .post(userController.deleteUser);

router
    .route('/userEvents')
    .get(userController.userEvents);

module.exports = router;