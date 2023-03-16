const User = require("../models/userModel");
const Meeting = require("../models/meetingModel")
const meetingController = require("./meetingController")

// route POST /api/users/createUser
async function createUser(req, res) {
    let existingUser = await User.findOne({userID : req.body.userID})
    if (existingUser) {
        await updateUserMeetings(req, res);
    }

    if (req.body.userID === undefined || req.body.meetingID === undefined)
        res.send({success : false, "error" : "Invalid user format"})
    let user = new User({
        userID : req.body.userID,
        meetingIDs : [req.body.meetingID],
        createdMeetingIDs : [req.body.meetingID]
    })
    await user.save()
    .then(() => {
        res.send({ success: true, user: user })
    })
    .catch((e) => {
        console.log(e)
        res.send({ success: false, error: `Could not save user object ${e}`, user: user })
    })
}

// route PUT /api/users/updateUserMeetings
async function updateUserMeetings(req, res) {
    if (req.body.userID === null || req.body.meetingID === null) {
        return res.send({ success: false, "error" : "Invalid user format"})
    }
    let user = await User.findOne({userID : req.body.userID})
    if (!user)
        return res.status(404).send({ success: false, error: `User ${req.body.userID} does not exist` })
    let meetings = user.toJSON().meetingIDs

    meetings.push(req.body.meetingID)
    await User.updateOne({
        "userID" : req.body.userID}, {$set : {"meetingIDs" : meetings}})
    .then(() => {
        return res.send({ success: true, user : user})
    })
    .catch((e) => {
        console.log(e)
        return res.send({ success: false, user : {userID : user.userID, meetingIDs : meetings}})
    })
    if (req.body.isCreated) {
        let createdMeetings = user.toJSON().createdMeetingIDs;
        createdMeetings.push(req.body.meetingID);
        await User.updateOne({
            "userID" : req.body.userID}, {$set : {"createdMeetingIDs" : createdMeetings}})
        .then(() => {
            return res.send({ success: true, user : {userID : user.userID, meetingIDs : meetings, createdMeetingIDs : createdMeetings}})
        })
        .catch((e) => {
            console.log(e)
            return res.send({ success: false, user : {userID : user.userID, meetingIDs : meetings, createdMeetingIDs : createdMeetings}})
        })
    }
}

// route GET /api/users/getUserMeetings
async function getUserMeetings(req, res) {
    if (req.query.userID !== null) {
        let user = await User.findOne({userID : req.query.userID})
        if (!user)
            return res.status(404).send({ success: false, error: `userID ${req.query.userID} does not exist` })
        res.send({ success: true, user: user })
    }
    else {
        res.send({ success: false, error: "Need to specify query user"})
    }
}

// route DELETE /api/users/detachMeeting
async function detachMeeting(req, res) {
    let userID = req.body.userID;
    let meetingID = req.body.meetingID;
    if (userID !== null && meetingID !== null) {
        let user = await User.findOne({userID : userID})
        let meeting = await Meeting.findOne({meetingID : meetingID})
        if (!user || !meeting)
            return res.status(404).send({ success: false, error: `Issue with userID ${userID} or meetingID ${meetingID}` })

        let meetings = user.toJSON().meetingIDs
        let meetings_ = meetings.filter(e => e !== meetingID)
        let created = user.toJSON().createdMeetingIDs
        let created_ = created.filter(e => e !== meetingID)

        let response = ""
        // If user is meeting member
        if (meeting.toJSON().organizer !== userID) {
            response = await removeUser(userID, meetingID);
            console.log("removeUser() res:", response)
        }
        // If user is meeting creator
        else {
            response = await deleteMeeting(meetingID);
            console.log("deleteMeeting() res:", response)
        }
        console.log("Starting updateMany")

        await User.updateMany(
            {"userID" : userID}, 
            [
                {$set : {"meetingIDs" : meetings_}},
                {$set : {"createdMeetingIDs" : created_}}
            ]
        )
        .then(() => {
            console.log("HERE");
            res.send({ success: true, user: user} );
        })
        .catch((e) => {
            console.log(e);
        })
    }
    else {
        res.send({ success: false, error: "Need to specify query user"})
    }
}

async function removeUser(userID, meetingID) {
    if (!userID || !meetingID) {
        return false;
    }
    let meeting = await Meeting.findOne({meetingID : meetingID});
    if (!meeting) {
        return { success: false, error: `Meeting ${meetingID} does not exist` };
    }
    
    let members = meeting.toJSON().meetingMemberIDs;
    let members_ = members.filter(e => e !== userID);
    let new_intersections = [];
    for (let avail of meeting.toJSON().intersections) {
        if (avail[2] !== userID) {
            new_intersections.push(avail);
        }
    }

    console.log(members, new_intersections);

    await Meeting.updateMany({
        "meetingID" : meetingID}, 
        [
            {$set : {"meetingMemberIDs" : members_}},
            {$set : {"intersections" : new_intersections}}
        ]
    )
    .then()
    .catch((e) => {
        return { success: false, meeting: meeting };
    })
    console.log(meeting)
    return ({ success: true, meeting: {intersection: new_intersections, meetingMemberIDs: members_} });
}

// route DELETE /api/meeting/deleteMeeting
async function deleteMeeting(meetingID) {
    if (meetingID !== null) {
        let meeting = await Meeting.findOne({meetingID : meetingID});
        if (!meeting) {
            return false;
        }
        let intersections = meeting.toJSON().intersections;
        for (let intersection of intersections) {
            let user = await User.findOne({userID : intersection[2]})
            user = user.toJSON()
            let userMeetings = user.meetingIDs;
            let userMeetings_ = userMeetings.filter(e => e !== meetingID);
            await User.updateOne({"userID" : intersection[2]}, 
                {$set : {"meetingIDs" : userMeetings_}})
            .then()
            .catch((e) => {
                console.log(e)
                return { success: false, user: user };
            })
        }
        await meeting.remove();
        return true;
    }
    else {
        return false;
    }
}

module.exports = { createUser, getUserMeetings, updateUserMeetings, detachMeeting };