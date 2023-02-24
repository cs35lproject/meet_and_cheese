const express = require("express")
const app = express()
const mongoose = require("mongoose")
const dotenv = require('dotenv');
const cors = require('cors')

// Configure .env variables
dotenv.config({ path: '.env' });
const port = process.env.PORT || 27018
const local = process.env.URL || "mongodb://localhost:27017/db1"

// Connect to Mongoose
mongoose.Promise = global.Promise;
mongoose.connect(local);

// Middleware
app.use(cors({
    origin: "*"
}))

// Routes
app.use('/api/profiles', require('./routes/profileRoute'))

app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`.red);
})