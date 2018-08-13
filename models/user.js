const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {type: String, require: true},
    password: {type: String, require: true},
    firstName: {type: String, require: true},
    lastName: {type: String, require: false},
    dateOfBirth: {type: Date, require: true},
    sex: {type: Boolean, require: true},
    isActive: {type: Boolean, default: true},
    registrationDate: {type: Date, default: Date.now},
    updated: {type: Date, require: false, default: null},
    ip: {type: String, require: true}
});

const userModel = mongoose.model("Users", UserSchema);

module.exports = userModel;