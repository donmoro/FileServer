const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FileSchema = new Schema({
    fileName: {type: String, require: true},
    originalName: {type: String, require: true},
    size: {type: Number, require: true},
    uploaded: {type: Date, default: Date.now},
    ip: {type: String, require: true},
    mime: {type: String},
    isActive: {type: Boolean, require: true, default: false}
});

const fileModel = mongoose.model("Files", FileSchema);

module.exports = fileModel;