const crypto = require('crypto');
const Meeting = require("../models/meetingModel");
const { intersectionFind } = require("../intersectionFind");

// route PUT /api/events/updateMeeting
async function updateMeeting(req, res) {
    if (req.body.userID === undefined || req.body.availability === undefined || req.body.meetingID === undefined || req.body.meetingMemberIDs === undefined) {
        res.send({success : false, "error" : "Invalid meeting format"})
    }
    console.log("updateMeeting")
    let meeting = await Meeting.findOne({meetingID : req.body.meetingID})
        if (!meeting)
            return res.status(404).send({ success: false, error: `Meeting ${req.body.meetingID} does not exist` })
    meeting = meeting.toJSON()
    console.log("meeting:", meeting)
    let members = meeting.meetingMemberIDs
    Array.prototype.push.apply(members, req.body.meetingMemberIDs)
    let availabilities = meeting.intersections
    Array.prototype.push.apply(availabilities, req.body.availability)
    console.log("availabilities:", availabilities)
    console.log("members:", members)

    await Meeting.updateMany({
        "meetingID" : req.body.meetingID}, 
        [
            {$set : {"intersections" : availabilities}},
            {$set : {"meetingMemberIDs" : members}}
        ]
    )
    .then(() => {
        res.send({ success: true, meeting : {intersections : availabilities, meetingMemberIDs : members, meetingID : req.body.meetingID}})
    })
    .catch((e) => {
        console.log("updateMeeting", e)
        res.send({ success: false, meeting : {intersections : availabilities, meetingMemberIDs : members, meetingID : req.body.meetingID}})
    })
}

// route POST /api/events/createMeeting
async function createMeeting(req, res) {
    if (req.body.userID === undefined || req.body.availability === undefined) {
        res.send({success : false, "error" : "Invalid meeting format"})
    }
    let meetingID = crypto.randomBytes(5).toString('hex')
    let meeting = new Meeting({
        meetingID : meetingID,
        meetingMemberIDs : [req.body.userID],
        intersections : req.body.availability,
    })
    console.log(meeting)
    //console.log("meeting:", meeting)
    // console.log("createMeeting SENDING BACK MEETING")
    // res.send({ success: true, meeting: meeting })
    await meeting.save()
    .then(() => {
        res.send({ success: true, meeting: meeting })
    })
    .catch((e) => {
        console.log(e)
        res.send({ success: false, error: `Could not save meeting object ${e}`, meeting: meeting })
    })
}

async function getMeeting(req, res) {
    if (req.query.id !== null) {
        console.log("Called getMeeting from backend, looking for id:", req.query.id)
        //res.send({ success: false, error: "Disabled for testing"})
        let meeting = await Meeting.findOne({meetingID : req.query.id})
        if (!meeting)
            return res.status(404).send({ success: false, error: `Meeting ${meetingID} does not exist` })
        return res.send({ success: true, meeting: meeting })
    }
    else {
        res.send({ success: false, error: "Need to specify query id"})
    }
}

module.exports = { createMeeting, getMeeting, updateMeeting };