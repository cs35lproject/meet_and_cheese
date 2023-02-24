const Profile = require("../models/profileModel")

// route GET /api/profiles
exports.getProfile = async function (req, res) {
   console.log("Called get profile")
   console.log("req/res:", req, res)
}

// route PUT /api/profiles
exports.editProfile = async function (req, res) {
    console.log("Called edit profile")
    console.log("req/res:", req, res)
}

// route DELETE /api/profiles
exports.deleteProfile = async function (req, res) {
    console.log("Called delete profile")
    console.log("req/res:", req, res)
}

// route POST /api/profiles
exports.createProfile = async function (req, res) {
    console.log("entered createprofile")
    console.log("req:", req)

    // let profile = new Profile({
    //     profileInfo : {
    //         userID : "testID",
    //         username : "test",
    //         firstName : "Sebastian",
    //         lastName : "Cevallos",
    //         email : "test@gmail.com",
    //         password : "test"
    //     }
    // })
    
    // await profile.save()

    res.send({ success: true, data: "profile from backend" })
}