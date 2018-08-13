var mongoose = require('mongoose');

var mongoDB = 'mongodb://localhost/FileServer';
mongoose.connect(mongoDB);

mongoose.Promise = global.Promise;
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = db;