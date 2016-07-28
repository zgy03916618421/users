var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var ThemeSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    image: {type: String, required: true},
    top: {type: Boolean, default: false},

    status: {type: String, enum: ['enable', 'disable'], default: 'enable'},
    createdBy: {type: String, required: true},
    createtime: {type: Date, default: Date.now},
    updatedBy: {type: String, required: true},
    updatetime: {type: Date, default: Date.now}
});

var ThemeModel = mongoose.model("theme", ThemeSchema, "theme");




