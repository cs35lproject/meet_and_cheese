const Event = require("../models/eventModel");
const User = require("../models/userModel");
const { db_removeV, db_createEvent, db_joinEvent, db_leaveEvent, db_editEvent } = require("../graphDB");

const readReq = async (req) => {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            resolve(JSON.parse(body));
        });
    });
}

// route POST /api/events
async function createEvent(req, res) {
    console.log("Called createEvent");

    const body = await readReq(req);
    const event = body.event;
    const user = body.user;

    // Validate body
    if (event._id === undefined || event.name === undefined || event.owner === undefined || event.constraint === undefined) {
        res.send({ success: false });
        console.log("Event not created (validation failed)");
        return;
    }
    if (user._id === undefined || user.name === undefined || user.email === undefined || user.events === undefined) {
        res.send({ success: false });
        console.log("Event not created (validation failed)");
        return;
    }

    if (await db_createEvent(user, event)) {
        res.send({ success: true });
        console.log("Event created");
    }
    else{
        res.send({ success: false });
        console.log("Event not created");
    }
}

// route POST /api/events
async function deleteEvent(req, res) {
    console.log("Called deleteEvent");

    const body = await readReq(req);
    const event = body.event;

    // Validate body
    if (event._id === undefined || event.name === undefined || event.owner === undefined || event.constraint === undefined) {
        res.send({ success: false });
        console.log("Event not deleted (validation failed)");
        return;
    }

    if (await db_removeV(event)) {
        res.send({ success: true });
        console.log("Event deleted");
    }
    else{
        res.send({ success: false });
        console.log("Event not deleted");
    }
}
 
// route POST /api/events
async function joinEvent(req, res){
    console.log("Called joinEvent");
    
    const body = await readReq(req);
    const event = body.event;
    const user = body.user;

    // Validate body
    if (event._id === undefined || event.name === undefined || event.owner === undefined || event.constraint === undefined) {
        res.send({ success: false });
        console.log("User not joined (validation failed)");
        return;
    }
    if (user._id === undefined || user.name === undefined || user.email === undefined || user.events === undefined) {
        res.send({ success: false });
        console.log("User not joined (validation failed)");
        return;
    }

    if (await db_joinEvent(event, user)) {
        res.send({ success: true });
        console.log("User joined");
    }
    else{
        res.send({ success: false });
        console.log("User not joined");
    }
}

// route POST /api/events
async function leaveEvent(req, res){
    console.log("Called leaveEvent");

    const body = await readReq(req);
    const event = body.event;
    const user = body.user;

    // Validate body
    if (event._id === undefined || event.name === undefined || event.owner === undefined || event.constraint === undefined) {
        res.send({ success: false });
        console.log("User not left (validation failed)");
        return;
    }
    if (user._id === undefined || user.name === undefined || user.email === undefined || user.events === undefined) {
        res.send({ success: false });
        console.log("User not left (validation failed)");
        return;
    }

    if (await db_leaveEvent(event, user)) {
        res.send({ success: true });
        console.log("User left");
    }
    else{
        res.send({ success: false });
        console.log("User not left");
    }
}

async function editEvent(req, res) {
    console.log("Called editEvent");

    const body = await readReq(req);
    const event = body.event;

    // Validate body
    if (event._id === undefined || event.name === undefined || event.owner === undefined || event.constraint === undefined) {
        res.send({ success: false });
        console.log("Event not edited (validation failed)");
        return;
    }

    if (await db_editEvent(event)) {
        res.send({ success: true });
        console.log("Event edited");
    }
    else{
        res.send({ success: false });
        console.log("Event not edited");
    }
}

module.exports = { createEvent, deleteEvent, joinEvent, leaveEvent, editEvent };