const crypto = require('crypto');
const Meeting = require("../models/meetingModel");

// route PUT /api/meeting/updateMeeting
async function updateMeeting(req, res) {
    console.log("updateMeeting")
    if (req.body.userID === undefined || req.body.availability === undefined || req.body.meetingID === undefined || req.body.meetingMemberIDs === undefined) {
        return res.send({success : false, "error" : "Invalid meeting format"})
    }
    let meeting = await Meeting.findOne({meetingID : req.body.meetingID})
        if (!meeting)
            return res.status(404).send({ success: false, error: `Meeting ${req.body.meetingID} does not exist` })
    meeting = meeting.toJSON()
    console.log("meeting:", meeting)
    let members = meeting.meetingMemberIDs
    members.push(req.body.userID)
    let availabilities = meeting.intersections
    Array.prototype.push.apply(availabilities, req.body.availability)

    await Meeting.updateMany({
        "meetingID" : req.body.meetingID}, 
        [
            {$set : {"intersections" : availabilities}},
            {$set : {"meetingMemberIDs" : members}}
        ]
    )
    .then(() => {
        return res.send({ success: true, meeting : {intersections : availabilities, meetingMemberIDs : members, meetingID : req.body.meetingID}})
    })
    .catch((e) => {
        console.log("updateMeeting", e)
        return res.send({ success: false, meeting : {intersections : availabilities, meetingMemberIDs : members, meetingID : req.body.meetingID}})
    })
}

// route PUT /api/meeting/removeUser
async function removeUser(req, res) {
    let userID = req.body.userID;
    let meetingID = req.body.meetingID;
    if (!userID || !meetingID) {
        return res.send({success : false, "error" : "Must specify userID & meetingID"})
    }
    let meeting = await Meeting.findOne({meetingID : meetingID})
        if (!meeting)
            return res.status(404).send({ success: false, error: `Meeting ${meetingID} does not exist` })

    meeting = meeting.toJSON()
    let members = meeting.meetingMemberIDs
    members = members.filter(e => e !== userID)
    let new_intersections = []
    for (let avail of meeting.intersections) {
        if (avail[2] !== userID) {
            new_intersections.push(avail);
        }
    }
    await Meeting.updateMany({
        "meetingID" : meetingID}, 
        [
            {$set : {"meetingMemberIDs" : members}},
            {$set : {"intersections" : new_intersections}}
        ]
    )
    .then(() => {
        res.send({ success: true, meeting})
    })
    .catch((e) => {
        res.send({ success: false, meeting : meeting })
    })
}

// route DELETE /api/meeting/
async function deleteMeeting(req, res) {
    console.log("deleteMeeting")
    let meetingID = req.query.id || req.body.meetingID
    if (meetingID !== null) {
        let meeting = await Meeting.findOne({meetingID : meetingID})
        console.log(meetingID)
        if (!meeting)
            return res.status(404).send({ success: false, error: `Meeting ${userID} does not exist` })
        await meeting.remove()
        return res.send({ success: true })
    }
    else {
        return res.send({ success: false, error: "Need to specify query id"})
    }
}

// route POST /api/meeting/createMeeting
async function createMeeting(req, res) {
    if (req.body.userID === undefined || req.body.availability === undefined) {
        res.send({success : false, "error" : "Invalid meeting format"})
    }
    let meetingID = crypto.randomBytes(8).toString('hex')
    let meeting = new Meeting({
        meetingID : meetingID,
        organizer : req.body.userID,
        meetingMemberIDs : [req.body.userID],
        intersections : req.body.availability,
    })
    await meeting.save()
    .then(() => {
        res.send({ success: true, meeting: meeting })
    })
    .catch((e) => {
        console.log(e)
        res.send({ success: false, error: `Could not save meeting object ${e}`, meeting: meeting })
    })
}

// route GET /api/meeting/getMeeting
async function getMeeting(req, res) {
    let userID = req.query.id || req.body.userID
    if (userID !== null) {
        console.log("Called getMeeting from backend, looking for id:", userID)
        //res.send({ success: false, error: "Disabled for testing"})
        let meeting = await Meeting.findOne({meetingID : userID})
        if (!meeting)
            return res.status(404).send({ success: false, error: `Meeting ${userID} does not exist` })
        return res.send({ success: true, meeting: meeting })
    }
    else {
        return res.send({ success: false, error: "Need to specify query id"})
    }
}

module.exports = { createMeeting, getMeeting, updateMeeting, removeUser, deleteMeeting };