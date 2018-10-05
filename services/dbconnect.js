const mongoose = require('mongoose');

const mongoDB = 'mongodb://localhost:27017/FileServer';
mongoose.connect(mongoDB, {useNewUrlParser: true})
    .then(() => console.log('connecting to database successful'))
    .catch(err => console.error('could not connect to mongo DB', err));

mongoose.Promise = global.Promise;
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = db;