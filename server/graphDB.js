/*******************************************************
 *            COPYRIGHT 2023 YASSIN KORTAM             *
 * USE OF THIS SOURCE CODE IS GOVERNED BY AN MIT-STYLE *
 * LICENSE THAT CAN BE FOUND IN THE LICENSE FILE OR AT *
 *        HTTPS://OPENSOURCE.ORG/LICENSES/MIT.         *
 *******************************************************/

const Gremlin = require("gremlin");
const dotenv = require('dotenv');

// Configure .env variables
dotenv.config({ path: '.env' });
const database = process.env.DATABASE;
const collection = process.env.COLLECTION;
const primaryKey = process.env.PRIMARYKEY;
const endpoint = process.env.ENDPOINT;

const authenticator = new Gremlin.driver.auth.PlainTextSaslAuthenticator(`/dbs/${database}/colls/${collection}`, primaryKey)

const client = new Gremlin.driver.Client(
    endpoint, 
    { 
        authenticator,
        traversalsource : "g",
        rejectUnauthorized : true,
        mimeType : "application/vnd.gremlin-v2.0+json"
    }
);

// Open client
async function db_openGremlin(){
    await client.open();
    return client.isOpen();
}

// Close client
async function db_closeGremlin(){
    await client.close();
    return !client.isOpen();
}

// Random ID generator
// Returns string
function db_makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

/* ************************************************** DATABASE OPERATIONS ************************************************** */

// OBJECT FORMATS
// Event object: {"id":"id", "name":"name", "owner":"owner"}
// User object: {"id":"id", "name":"name"}

// Check if a vertex exists
// Can be used to check user accounts and events
// Returns boollean 
async function db_checkV(V){
    return Array.from(await client.submit("g.V().has('partition_key',id)", {
        id : V._id
    })).length != 0;
}

// Check if an edge exists
// Can be used to check user links to events
// Returns boollean 
async function db_checkE(V1, V2){
    return Array.from(await client.submit("g.V().has('partition_key',id1).outE().inV().has('partition_key', id2)", {
        id1 : V1._id,
        id2 : V2._id
    })).length != 0;
}

// NEEDS UPDATING
// WHEN A USER IS DELETED, UPDATE ALL THEIR EVENTS
// Remove a Vertex
// Can be used to delete user accounts and events
// Returns boollean 
async function db_removeV(V){
    if (!( await db_checkV(V))) return false;
    return await client.submit("g.V().has('partition_key', id).drop()",{
        id : V._id
    }) && true;
}

// Create a new user
// Takes user object
// Returns boollean 
async function db_createUser(user){
    if (await db_checkV(user)) return false;
    return Array.from(await client.submit("g.addV(label, 'user', 'partition_key', id, 'name', name, 'email', email, 'events', events)",{
        id : user._id,
        name : user.name,
        email : user.email,
        events : JSON.stringify(user.events)
    })).length != 0 ;
}

// Create a new event
// Takes user and event objects
// Returns boollean 
async function db_createEvent(user, event){
    if (await db_checkV(event)) return false;
    const usersEvents = [];
    const created = Array.from(await client.submit("g.addV(label, 'event', 'name', name, 'partition_key', id, 'owner', owner, 'constraint', constraint, 'usersEvents', usersEvents)",{
        name : event.name,
        id : event._id,
        owner : event.owner,
        constraint : JSON.stringify(event.constraint),
        usersEvents : JSON.stringify(usersEvents)
    })).length != 0;
    const joined = await db_joinEvent(user, event);
    return created && joined;
}

// Join an existing user to an existing event
// Takes user and event objects
// Returns boollean
async function db_joinEvent(user, event){
    if (!(await db_checkV(user)) || !(await db_checkV(event))) return false;

    // Get usersEvents object
    const usersEvents_s = Array.from(await client.submit("g.V().has('partition_key', event)", {
        event : event._id
    }))[0].properties.usersEvents[0].value;

    // Update usersEvents object
    const userEvents = {
        id : user._id,
        events : user.events
    };

    const usersEvents = JSON.parse(usersEvents_s)
    usersEvents.push(userEvents);
    
    // Update event
    const updated = Array.from(await client.submit("g.V().has('partition_key', event).property('usersEvents', usersEvents)", {
        event : event._id,
        usersEvents : JSON.stringify(usersEvents)
    })).length != 0;
    const connected = Array.from(await client.submit("g.V().has('partition_key', user).addE('attending').to(g.V().has('partition_key', event))", {
        user : user._id,
        event : event._id
    })).length != 0;
    
    return updated && connected;
}

// Remove an existing user from an existing event
// Takes user and event objects
// Returns boollean
async function db_leaveEvent(user, event){
    if (!(await db_checkV(user)) || !(await db_checkV(event))) return false;

    // remove user from event
    await client.submit("g.V().has('partition_key', user).bothE().where(otherV().has('partition_key',event)).drop()", {
        user : user._id,
        event : event._id
    });

    // Get usersEvents object
    const usersEvents_s = Array.from(await client.submit("g.V().has('pariton_key', event)", {
        event : event._id
    }))[0].usersEvents;

    // Update usersEvents object
    const usersEvents = JSON.parse(usersEvents_s);
    const index = usersEvents.findIndex((userEvents) => userEvents.id == user._id);
    usersEvents.splice(index, 1);

    // Update event
    return await client.submit("g.V().has('partition_key', event).property('usersEvents', usersEvents)", {
        event : event._id,
        usersEvents : JSON.stringify(usersEvents)
    }) && true;
}

// NEEDS TESTING
// NO API ENDPOINT
// Get all the events the user is associated with
// Takes user object
// Returns array of event objects
async function db_userEvents(user){
    return await client.submit("g.V().has('partition_key', user).outE().inV()",{
        user : user._id
    });
}

// Get all the users associated with an event
// Takes event object
// Returns array of user objects
async function db_eventUsers(event){
    return await client.submit("g.V().has('partition_key', event).inE().outV()",{
        event : event._id
    });
}

// NEEDS TESTING
// NO API ENDPOINT
// Edit a user
// Can only change name, email, and events
// Takes user object
// Returns boollean
async function db_editUser(user){
    if (!(await db_checkV(user))) return false;
    const userUpdated = Array.from(await client.submit("g.V().has('partition_key', id).property('name', name).property('email', email).property('events', events)",{
        id : user._id,
        name : user.name,
        email : user.email,
        events : JSON.stringify(user.events)
    })).length != 0;

    // Get usersEvents object
    let userEventsUpdated = true;
    const userEventsObjects = Array.from(await db_userEvents(user)).map(async event => {
        // For each event
        const userEventsObject = JSON.parse(event.properties.usersEvents[0].value);
        for (const userEvents of userEventsObject){
            if (userEvents.id == user._id){
                userEvents.events = user.events;
            };
        }
        userEventsUpdated = userEventsUpdated && Array.from(await client.submit("g.V().has('partition_key', id).property('usersEvents', usersEvents)",{
            id : event.id,
            usersEvents : JSON.stringify(eventsObject)
        })).length != 0;
    });
    return userUpdated && userEventsUpdated;
}

// NEEDS TESTING
// NO API ENDPOINT
// Edit an event
// Can only change name and constraint
// Takes event object
// Returns boollean
async function db_editEvent(event){
    if (!(await db_checkV(event))) return false;
    return Array.from(await client.submit("g.V().has('partition_key', id).property('name', name).property('constraint', constraint)",{
        id : event._id,
        name : event.name,
        constraint : JSON.stringify(event.constraint)
    })).length != 0;
}

/* ************************************************** TEST CASES ************************************************** */

//Test case variables
const testUser = {
    _id : db_makeid(12),
    name : db_makeid(12),
    email : db_makeid(12),
    events : [[1,2],[3,4]]
};

const testEvent = {
    _id : db_makeid(12),
    name : db_makeid(12),
    owner : testUser._id,
    constraint : [[1,2],[3,4]]
};

// Additive Testcase
// Try creating new nodes
async function db_additiveTest(){
    console.assert(await db_checkV(testUser) === false, "checkV failed (user should not exist)");
    console.assert(await db_checkV(testEvent) === false, "checkV failed (event should not exist)");
    console.assert(await db_createUser(testUser), "createUser failed (make sure ID is unique)");
    console.assert(await db_createEvent(testUser, testEvent), "createEvent &/|| join event failed (make sure IDs are unique)");
    console.assert(await db_checkV(testUser), "checkV failed (user should exist)");
    console.assert(await db_checkV(testEvent), "checkV failed (event should exist)");
    console.assert(await db_checkE(testUser, testEvent), "checkE failed");
}

// State Testcase
// Must run after additive testcase
async function db_stateTest(){
    console.assert(Array.from(await db_userEvents(testUser).length === 1, "failed to fetch testUser events"));

    //Does not have an endpoint in the API (Not sure if it is useful)
    //console.assert(Array.from(await db_eventUsers(testEvent).length === 1, "failed to fetch testEvent users"));
}

// Subtractive Testcase
// Try deleting nodes and edges
// Must run after additive testcase
async function db_subtractiveTest(){
    console.assert(await db_leaveEvent(testUser, testEvent), "leaveEvent failed");
    console.assert(await db_removeV(testUser), "removeV failed on testUser");
    console.assert(await db_removeV(testEvent), "removeV failed on testEvent");
    console.assert(await db_checkV(testUser) === false, "checkV failed (user should not exist)");
    console.assert(await db_checkV(testEvent) === false, "checkV failed (event should not exist)");
    console.assert(await db_checkE(testUser, testEvent) === false, "checkE failed (edge should not exist)");
}

module.exports = { 
    db_additiveTest,
    db_stateTest,
    db_subtractiveTest,
    db_makeid,
    db_openGremlin, 
    db_closeGremlin, 
    db_checkV, 
    db_removeV, 
    db_createUser, 
    db_createEvent, 
    db_joinEvent, 
    db_leaveEvent, 
    db_userEvents, 
    db_eventUsers 
};