var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var SpinetmpSchema = new Schema({
    url : String,
    sources : String,
    isbn : String,
    type : String,
    floor_id : String,
    scan_id : String,
    bid : String,
    meta : Array,
    user_vip_level : {type : Number, default : 0},
    isPush : Boolean,

    status : {type : String, default :"visable"},
    version : {type : Date, default : new Date()},
    createuserid : {type : String, default : "admin"},
    updateuserid : {type : String, default : "admin"},
    createtime : {type : Date, default : Date.now()},
    updatetime : {type : Date, default : Date.now()}

});
var spinetmpModel = mongoose.model("spinetmp", SpinetmpSchema, "spinetmp");




