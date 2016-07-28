var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var InvitationlogSchema = new Schema({
    code : String,
    mobile_number : String,

    status : {type : String, default : "visible"},
    version : {type : Date, default : new Date()},
    createuserid : {type : String, default : "admin"},
    updateuserid : {type : String, default : "admin"},
    createtime : {type : String, default : new Date().valueOf()},
    updatetime : {type : String, default : new Date().valueOf()}
});
var invitationlogModel = mongoose.model("invitationlog", InvitationlogSchema, "invitationlog");




