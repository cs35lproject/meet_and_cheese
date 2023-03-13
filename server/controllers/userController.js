const User = require("../models/userModel");
const { intersectionFind } = require("../intersectionFind");
const { db_removeV, db_createUser, db_userEvents, db_editUser } = require("../graphDB");

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

// route POST /api/users
async function createUser(req, res) {
    console.log("Called createUser");

    //const body = await readReq(req);
    const body = req.body
    //const user = body.user;
    const user = body

    console.log("body:")
    console.log(body)
    console.log("user:")
    console.log(user)

    // Validate body
    if (user._id === undefined || user.name === undefined || user.email === undefined || user.events === undefined) {
        res.send({ success: false });
        console.log("User not created (validation failed)");
        return;
    }

    if (await db_createUser(user)) {
        res.send({ success: true });
        console.log("User created");
    }
    else{
        console.log("User not created");
        res.send({ success: false });
    }
}

// route POST /api/users
async function deleteUser(req, res) {
    console.log("Called deleteUser");

    const body = await readReq(req);
    const user = body.user;

    // Validate body
    if (user._id === undefined || user.name === undefined || user.email === undefined || user.events === undefined) {
        res.send({ success: false });
        console.log("User not deleted (validation failed)");
        return;
    }

    if (await db_removeV(user)) {
        res.send({ success: true });
        console.log("User deleted");
    }
    else{
        res.send({ success: false });
        console.log("User not deleted");
    }
}

// get user info given id
// run intersection find on that with constraint [start,end] (like 8am-2pm)

// route GET /api/users
async function userEvents(req, res) {
    console.log("Called userEvents");

    const user = req.query.id;

    console.log(user)

    let userEvents = Array.from(await db_userEvents(user));
    console.log("a")
    let usersEventsObjects = userEvents.map(event => ({
        constraint : JSON.parse(event.properties.constraint[0].value), 
        eventsObject : JSON.parse(event.properties.usersEvents[0].value)
    }));

    let userIntersections = usersEventsObjects.map(usersEvents => {
        // Find the intersection of all users events for each event
        let intersection = usersEvents.constraint;
        for (const event of usersEvents.eventsObject) {
            intersection = intersectionFind(intersection, event.events);
        }
        return intersection;
    });

    // Zip together intersection and events
    // Add the intersection to the event object
    const events = userEvents.map((event, index) => {
        event.usersEvents = JSON.parse(event.properties.usersEvents[0].value);
        event.intersection = userIntersections[index];
        return event;
    });

    if (events) {
        res.send({ success: true, events: events });
        console.log("User events retrieved");
    }
    else{
        res.send({ success: false });
        console.log("User events not retrieved");
    }
}

async function editUser(req, res) {
    console.log("Called editUser");

    const body = await readReq(req);
    const user = body.user;

    // Validate body
    if (user._id === undefined || user.name === undefined || user.email === undefined || user.events === undefined) {
        res.send({ success: false });
        console.log("User not edited (validation failed)");
        return;
    }

    if (await db_editUser(user)) {
        res.send({ success: true });
        console.log("User edited");
    }
    else{
        res.send({ success: false });
        console.log("User not edited");
    }
}

module.exports = { createUser, deleteUser, userEvents, editUser };