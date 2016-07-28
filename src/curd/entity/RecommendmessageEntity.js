var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var RecommendmessageSchema = new Schema({
    floor_id : String,
    floor_name : String,
    sender_id : String,
    sender_name : String,
    sender_avatar : String,
    receiver_id : String,
    receiver_name : String,
    receiver_avatar : String,
    remark : String,
    cover : String,
    author : Array,
    title : String,
    publisher : String,

    status : {type : String, default : "visible"},   //状态分别可以为 visible,hidden,deleted
    version : {type : Date, default : new Date()},
    createuserid : {type : String, default : "admin"},
    updateuserid : {type : String, default : "admin"},
    createtime : {type : String, default : new Date().valueOf()},
    updatetime : {type : String, default : new Date().valueOf()}


});
var recommendmessageModel = mongoose.model("recommendmessage", RecommendmessageSchema, "recommendmessage");




