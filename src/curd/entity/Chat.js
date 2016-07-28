var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var ChatSchema = new Schema({
    content : String,
    sender_id : String,
    receiver_id : String,
    type : {type : String, default :"private"},

    status : {type : String, default :"visable"},
    version : {type : Date, default : new Date()},
    createuserid : {type : String, default : "admin"},
    updateuserid : {type : String, default : "admin"},
    createtime : {type : String, default : Date.now()},
    updatetime : {type : String, default : Date.now()}

});
var chatModel = mongoose.model("chat", ChatSchema, "chat");




