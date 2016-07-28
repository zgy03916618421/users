var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var IndexSchema = new Schema({
    index_count : Number,

    status : {type : String, default :"visable"},
    version : {type : Number, default : Date.now()},
    createuserid : {type : String, default : "admin"},
    updateuserid : {type : String, default : "admin"},
    createtime : {type : String, default : new Date().valueOf()},
    updatetime : {type : String, default : new Date().valueOf()}


});
var indexModel = mongoose.model("index", IndexSchema, "index");




