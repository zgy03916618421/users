var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;


var Logs_activeuserSchema = new Schema({
    _id : Object,
    value : Object

});
mongoose.model("logs_activeuser", Logs_activeuserSchema, "stats.daily");




