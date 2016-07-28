var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var ScanbehaviorSchema = new Schema({
    bsid : String,
    title : String,
    author : String,
    publisher : String,
    translator : String,
    price : String,
    rating : Object,
    meta : Array,
    location : Array ,
    user_id : String ,
    bid : String,
    images : Object,
    type : String,

    version : {type : Date, default : new Date()},
    createuserid : {type : String, default : "admin"},
    updateuserid : {type : String, default : "admin"},
    createtime : {type : String, default : new Date().valueOf()},
    updatetime : {type : String, default : new Date().valueOf()}

});
var scanbehaviorModel = mongoose.model("scanbehavior", ScanbehaviorSchema, "scanbehavior");




