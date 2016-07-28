var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var ScanbookSchema = new Schema({
    scan_id : String,
    bid : String,
    user_id : String,
    location : Array,
    meta : String,
    type : String,
    title :String,
    author : Array,
    pubdate : String,
    publisher : String,
    translator : Array,
    images : Object,
    isbn : String,
    price : String,
    
    status : {type : String, default :"visable"},
    version : {type : Date, default : new Date()},
    createtime : {type : String, default : new Date().valueOf()},
    updatetime : {type : String, default : new Date().valueOf()}

});
var scanbookModel = mongoose.model("scanbook", ScanbookSchema, "scanbook");




