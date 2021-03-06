var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var ReportSchema = new Schema({
    review_id : String,                  //书ID
    sender_id : String,
    receiver_id : String,
    content : String,

    sender_name : String ,
    receiver_name : String,
    sender_avatar : String,


    status : {type : String, default : "visible"},   //状态分别可以为 visible,hidden,deleted
    version : {type : Date, default : new Date()},
    createuserid : {type : String, default : "admin"},
    updateuserid : {type : String, default : "admin"},
    createtime : {type : String, default : new Date().valueOf()},
    updatetime : {type : String, default : new Date().valueOf()}


});
var reportModel = mongoose.model("report", ReportSchema, "report");




