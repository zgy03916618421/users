var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var ScanSchema = new Schema({
    user_id : String,
    image : String,
    location :  Array,
    spine_count : Number,

    favour :{type : Number, default :0},
    count :{type : Number, default : 0},
    status : {type : String, default :"visable"},
    version : {type : Date, default : new Date()},
    createuserid : {type : String, default : "admin"},
    updateuserid : {type : String, default : "admin"},
    createtime : {type : String, default : new Date().valueOf()},
    updatetime : {type : String, default : new Date().valueOf()}
});
var scanModel = mongoose.model("scan", ScanSchema, "scan");




