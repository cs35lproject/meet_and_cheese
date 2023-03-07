const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const cors = require('cors');

// Configure .env variables
dotenv.config({ path: '.env' });
const port = process.env.PORT || 3000;
const local = process.env.URL || "mongodb://localhost:27017/db1";

// Connect to Mongoose
mongoose.Promise = global.Promise;
mongoose.set('strictQuery', false);
mongoose.connect(local);

// // Test graphDB
// const {db_additiveTest} = require('./graphDB');
// (async () => { 
//     await db_additiveTest(); 
// })();

// Middleware (None configured)
app.use(cors({
    origin: "*"
}));

// Routes
app.use('/api/user', require('./routes/userRoute'));
app.use('/api/event', require('./routes/eventRoute'));

app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`.red);
})

// For testing
module.exports = app;