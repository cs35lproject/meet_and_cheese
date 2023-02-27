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
async function openGremlin(){
    return await client.open();
}

// Close client
async function closeGremlin(){
    return await client.close();
}

// Random ID generator
// Returns string
function makeid(length) {
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
async function checkV(V){
    return Array.from(await client.submit("g.V().has('partition_key',id)", {
        id : V.id
    })).length != 0;
}

// Remove a Vertex
// Can be used to delete user accounts and events
// Returns boollean 
async function removeV(V){
    if (!( await checkV(V))) return false;
    return await client.submit("g.V().has('partition_key', id).drop()",{
        id : V.id
    }) && true;
}

// Create a new user
// Takes user object
// Returns boollean 
async function createUser(user){
    if (await checkV(user)) return false;
    return await client.submit("g.addV(label, 'user', 'name', name, 'partition_key', id)",{
        name : user.name,
        id : user.id
    }) && true;
}

// Create a new event
// Takes user and event objects
// Returns boollean 
async function createEvent(user, event){
    if (await checkV(event)) return false;
    return await client.submit("g.addV(label, 'event', 'name', name, 'partition_key', id, 'owner', owner)",{
        name : event.name,
        id : event.id,
        owner : event.owner
    }) && await joinEvent(user, event);
}

// Join an existing user to an existing event
// Takes user and event objects
// Returns boollean
async function joinEvent(user, event){
    if (!(await checkV(user)) || !(await checkV(event))) return false;
    return await client.submit("g.V().has('partition_key', user).addE('attending').to(g.V().has('partition_key', event))", {
        user : user.id,
        event : event.id
    }) && true;
}

// Remove an existing user from an existing event
// Takes user and event objects
// Returns boollean
async function leaveEvent(user, event){
    if (!(await checkV(user)) || !(await checkV(event))) return false;
    return await client.submit("g.V().has('partition_key', user).bothE().where(otherV().has('partition_key',event)).drop()", {
        user : user.id,
        event : event.id
    }) && true;
}

// Get all the events the user is associated with
// Takes user object
// Returns array of event objects
async function userEvents(user){
    return await client.submit("g.V().has('partition_key', user).outE().inV()",{
        user : user.id
    });
}

// Get all the users associated with an event
// Takes event object
// Returns array of user objects
async function eventUsers(event){
    return await client.submit("g.V().has('partition_key', event).inE().outV()",{
        event : event.id
    });
}

/* ************************************************** TEST CASES ************************************************** */

//Test case variables
const testUser = {"name":"TestName", "id":makeid(12)};
const testEvent = {"name":"TestEvent", "id":makeid(12),"owner":testUser.id };

// Additive Testcase
// Try creating new nodes
async function additiveTest(){
    console.assert(await createUser(testUser), "createUser failed (make sure ID is unique)");
    console.assert(await createEvent(testUser, testEvent), "createEvent &/|| join event failed (make sure IDs are unique)");
}

// State Testcase
// Must run after additive testcase
async function stateTest(){
    console.assert(Array.from(await userEvents(testUser).length === 1, "failed to fetch testUser events"));
    console.assert(Array.from(await eventUsers(testEvent).length === 1, "failed to fetch testEvent users"));
}

// Subtractive Testcase
// Try deleting nodes and edges
// Must run after additive testcase
async function subtractiveTest(){
    console.assert(await leaveEvent(testUser, testEvent), "leaveEvent failed");
    console.assert(await removeV(testUser), "removeV failed on testUser");
    console.assert(await removeV(testEvent), "removeV failed on testEvent");
}

module.exports = { 
    additiveTest,
    stateTest,
    subtractiveTest,
    makeid,
    openGremlin, 
    closeGremlin, 
    checkV, 
    removeV, 
    createUser, 
    createEvent, 
    joinEvent, 
    leaveEvent, 
    userEvents, 
    eventUsers 
};