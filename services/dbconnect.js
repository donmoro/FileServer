const mongoose = require('mongoose');

const mongoDB = 'mongodb://localhost/FileServer';
mongoose.connect(mongoDB);

mongoose.Promise = global.Promise;
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = db;