/*******************************************************
 *            COPYRIGHT 2023 YASSIN KORTAM             *
 * USE OF THIS SOURCE CODE IS GOVERNED BY AN MIT-STYLE *
 * LICENSE THAT CAN BE FOUND IN THE LICENSE FILE OR AT *
 *        HTTPS://OPENSOURCE.ORG/LICENSES/MIT.         *
 *******************************************************/

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const { db_makeid } = require('../graphDB');
const should = chai.should();

chai.use(chaiHttp);

const testUser = {
    _id : db_makeid(12),
    name : db_makeid(12),
    email : db_makeid(12),
    events : [[1,2],[3,4]]
};

const testUser2 = {
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

describe("Additive tests", () => {
    describe("Creating a new user", () => {
        it("should create a new user", (done) => {
            chai.request(app)
                .post('/api/user/createUser')
                .send({user : testUser})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(true);
                    done();
                });
        });
    });
    describe("Creating a second user", () => {
        it("should create a new user", (done) => {
            chai.request(app)
                .post('/api/user/createUser')
                .send({user : testUser2})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(true);
                    done();
                });
        });
    });
    describe("Creating a new user twice", () => {
        it("should not create a new user twice", (done) => {
            chai.request(app)
                .post('/api/user/createUser')
                .send({user : testUser})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(false);
                    done();
                });
        });
    });
    describe("Creating a new event", () => {
        it("should create a new event", (done) => {
            chai.request(app)
                .post('/api/event/createEvent')
                .send({
                    user : testUser,
                    event : testEvent
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(true);
                    done();
                });
        })
    });
    describe("Creating an event twice", () => {
        it("should not create a new event twice", (done) => {
            chai.request(app)
                .post('/api/event/createEvent')
                .send({
                    user : testUser,
                    event : testEvent
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(false);
                    done();
                });
        })
    });
});

describe("Mutative tests", () => {
    describe("Joining an event", () => {
        it("should join an event", () => {
            chai.request(app)
                .post('/api/event/joinEvent')
                .send({
                    user : testUser2,
                    event : testEvent
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(true);
                });
        })
    });
    describe("Joining an event twice", () => {
        it("should not join an event twice", () => {
            chai.request(app)
                .post('/api/event/joinEvent')
                .send({
                    user : testUser2,
                    event : testEvent
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(false);
                });
        })
    });

    describe("Leaving an event", () => {
        it("should leave an event", () => {
            chai.request(app)
                .post('/api/event/leaveEvent')
                .send({
                    user : testUser2,
                    event : testEvent
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(true);
                });
        })
    });
});

describe("Descriptive tests", () => {
   describe("Getting events for a user", () => {
         it("should get all events for a user", (done) => {
            chai.request(app)
                .get('/api/user/userEvents')
                .query({user : testUser})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(true);
                    res.body.should.have.property('events');
                    done();
                });
         });
    });
});

describe("Subtractive tests", () => {
    describe("Deleting a user", () => {
        it("should delete a user", (done) => {
            chai.request(app)
                .post('/api/user/deleteUser')
                .send({user : testUser})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(true);
                    done();
                });
        });
    });
    describe("Deleting a second user", () => {
        it("should delete a user", (done) => {
            chai.request(app)
                .post('/api/user/deleteUser')
                .send({user : testUser2})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(true);
                    done();
                });
        });
    });
    describe("Deleting an event", () => {
        it("should delete an event", (done) => {
            chai.request(app)
                .post('/api/event/deleteEvent')
                .send({
                    user : testUser,
                    event : testEvent
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(true);
                    done();
                });
        })
    });
});

