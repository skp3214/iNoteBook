const mongoose = require('mongoose');
const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/inotebook";


const connectToMongo = () => {
    mongoose.connect(mongoURI);

    mongoose.connection.on('connected', () => {
        console.log("Connected to MongoDB");
    });
}

module.exports = connectToMongo;
