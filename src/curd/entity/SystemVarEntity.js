var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var SystemVarSchema = new Schema({
    _id: {type: String, required: true, unique: true},
    value : {type: Schema.Types.Mixed, required: true},
    name: {type: String, required: true, unique: true},
    type: {type: String, enum: ['lock'], required: true},

    created_by: {type: String, required: true},
    created_at: {type: Date, default: Date.now},
    updated_by: {type: String, required: true},
    updated_at: {type: Date, default : Date.now}
});

mongoose.model("systemvar", SystemVarSchema, "system_var");

module.exports = SystemVarSchema;


