const express = require("express")
const router = express.Router()
const profileController = require('../controllers/profileController')

router
    .route('/')
    .get((profileController.getProfile))
    .post((profileController.createProfile))
    .put((profileController.editProfile))
    .delete((profileController.deleteProfile))

module.exports = router;