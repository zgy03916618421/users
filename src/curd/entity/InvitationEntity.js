var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var InvitationSchema = new Schema({
    user_id : String,
    user_name : String,
    code : String,
    origin_count : Number,
    count : Number,
    type : {type : String, default :"automatic"},  // manual

    status : {type : String, default :"visable"},
    version : {type : Date, default : new Date()},
    createuserid : {type : String, default : "admin"},
    updateuserid : {type : String, default : "admin"},
    createtime : {type : String, default : new Date().valueOf()},
    updatetime : {type : String, default : new Date().valueOf()}


});
var invitationModel = mongoose.model("invitation", InvitationSchema, "invitation");




