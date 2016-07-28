var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var TagSchema = new Schema({
    name : String,

    status : {type : String, default :"visable"},
    version : {type : Date, default : new Date()},
    createuserid : {type : String, default : "admin"},
    updateuserid : {type : String, default : "admin"},
    createtime : {type : String, default : new Date().valueOf()},
    updatetime : {type : String, default : new Date().valueOf()}

});
var tagModel = mongoose.model("tag", TagSchema, "tag");




