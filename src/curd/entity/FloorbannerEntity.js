var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var FloorbannerSchema = new Schema({
    link : String,
    image : String,
    name : String,
    desc : String,
    power : Number,
    type : String,
    user : Object,
    floor : Object,

    status : {type : String, default :"visable"},
    version : {type : Date, default : new Date()},
    createuserid : {type : String, default : "admin"},
    updateuserid : {type : String, default : "admin"},
    createtime : {type : String, default : new Date().valueOf()},
    updatetime : {type : String, default : new Date().valueOf()}


});
var floorbannerModel = mongoose.model("floorbanner", FloorbannerSchema, "floorbanner");




