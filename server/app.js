const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const cors = require('cors');
var bodyParser = require("body-parser");

// Configure .env variables
dotenv.config({ path: '.env' });
const port = process.env.PORT || 7073;
const local = process.env.URL || "mongodb://localhost:7073/db1";

// Connect to Mongoose
mongoose.Promise = global.Promise;
mongoose.set('strictQuery', false);
mongoose.connect(local);

// Middleware
app.use(cors({
    origin: "*"
}));
app.use(bodyParser.json());

// Routes
app.use('/api/event', require('./routes/eventRoute'));

app.use('/api/meeting', require('./routes/meetingRoute'));
app.use('/api/user', require('./routes/userRoute'));

app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`.red);
})

module.exports = app;